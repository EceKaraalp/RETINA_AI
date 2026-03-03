import io
import base64
import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tensorflow as tf

# =========================
# Flask
# =========================
app = Flask(__name__)
CORS(app)
device = torch.device("cpu")

# =========================
# PYTORCH MODEL
# =========================
pt_model = models.densenet121(weights=None)
pt_model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(pt_model.classifier.in_features, 5)
)

pt_model.load_state_dict(torch.load("model.pth", map_location=device))
pt_model.eval()

PT_CLASS_NAMES = [
    "Sağlıklı",
    "Hafif Evre",
    "Orta Evre",
    "Ağır Evre",
    "Çok İleri Evre"
]

pt_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# =========================
# TENSORFLOW ODIR MODEL
# =========================
tf_model = tf.keras.models.load_model("odir_model.keras", compile=False)

ODIR_LABELS = [
    "Risk Yok",
    "Diyabetik Retinopati",
    "Katarakt",
    "Hipertansiyon",
    "Glokom",
    "AMD",
    "Myopi"
]

ODIR_THRESHOLD = 0.70 # 🔴 kritik eşik

# =========================
# GRAD-CAM
# =========================
def generate_gradcam(img_tensor, class_idx, original_np):
    gradients = []

    def hook(grad):
        gradients.append(grad)

    img_tensor.requires_grad_(True)
    features = pt_model.features(img_tensor)
    features.register_hook(hook)

    out = F.relu(features)
    out = F.adaptive_avg_pool2d(out, (1, 1))
    out = out.view(1, -1)
    logits = pt_model.classifier(out)

    score = logits[0, class_idx]
    pt_model.zero_grad()
    score.backward()

    grads = gradients[0]
    weights = torch.mean(grads, dim=(2, 3), keepdim=True)
    cam = torch.sum(weights * features, dim=1).squeeze()
    cam = F.relu(cam)
    cam /= cam.max()

    heatmap = cam.detach().cpu().numpy()
    heatmap = cv2.resize(heatmap, (224, 224))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    original = cv2.resize(original_np, (224, 224))
    overlay = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

    _, buffer = cv2.imencode(".png", overlay)
    return base64.b64encode(buffer).decode()

# =========================
# API
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    print(">>> PREDICT ÇAĞRILDI <<<")  # 🔴 BUNU EKLE
   
    file = request.files["image"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
  


    # ---- PyTorch DR ----
    pt_tensor = pt_transform(image).unsqueeze(0)
    with torch.no_grad():
        out = pt_model(pt_tensor)
        probs = torch.softmax(out, dim=1)
        idx = probs.argmax().item()
        dr_conf = float(probs[0, idx])

    heatmap = generate_gradcam(pt_tensor, idx, np.array(image))

    # ---- TensorFlow ODIR ----
    tf_img = image.resize((224, 224))
    tf_img = np.array(tf_img) / 255.0
    tf_img = np.expand_dims(tf_img, 0)

    print("Image mean:", np.mean(tf_img))

    odir_probs = tf_model.predict(tf_img, verbose=0)[0]
    print("ODIR RAW:", odir_probs)

    print("Image mean:", np.mean(tf_img))  # ✅ BURASI DOĞRU YER


    odir_probs = tf_model.predict(tf_img, verbose=0)[0]

    odir_results = []
    for label, prob in zip(ODIR_LABELS, odir_probs):
        if prob >= ODIR_THRESHOLD:
            odir_results.append({
                "label": label,
                "confidence": float(prob)
            })

    # 🔴 KARARSIZLIK KONTROLÜ
    if len(odir_results) == 0:
        odir_results.append({
            "label": "Kararsız",
            "confidence": float(np.max(odir_probs))
        })

    return jsonify({
        "success": True,
        "pytorch": {
            "label": PT_CLASS_NAMES[idx],
            "confidence": dr_conf
        },
        "odir": {
            "results": odir_results
        },
        "heatmap": f"data:image/png;base64,{heatmap}"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
