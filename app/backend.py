from flask import Flask, request, jsonify
import cv2
import numpy as np
from collections import Counter

app = Flask(__name__)

# ====================== IMAGE PREPROCESSING ======================
def preprocess_image(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, bg_mask = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    fg_mask = cv2.bitwise_not(bg_mask)

    h, s, v = cv2.split(hsv)
    s = cv2.add(s, 20)
    v = cv2.add(v, 20)
    hsv_boosted = cv2.merge([h, s, v])
    image_boosted = cv2.cvtColor(hsv_boosted, cv2.COLOR_HSV2BGR)

    lab = cv2.cvtColor(image_boosted, cv2.COLOR_BGR2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    image_corrected = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

    return image_corrected

# ====================== COLOR DETECTION ======================
def split_and_detect(image, sections=5):
    height, width, _ = image.shape
    section_height = height // sections
    horizontal_sections = [image[i * section_height:(i + 1) * section_height, :] for i in range(sections)]
    detected_colors = []

    def detect_color(image_section, hsv_section):
        color_ranges = {
            "magenta": ([140, 10, 50], [160, 255, 255]),
            "purple":  ([110, 10, 50], [135, 255, 255]),
            "blue":    ([96, 10, 50], [109, 255, 255]),    # starts from 96 to avoid overlapping green
            "green":   ([80, 10, 50], [95, 255, 255]),     # covers 90–95 to include borderline greens
            "yellow":  ([20, 10, 50], [40, 255, 255]),
}


        masks = {}
        for color, (lower, upper) in color_ranges.items():
            mask = cv2.inRange(hsv_section, np.array(lower, np.uint8), np.array(upper, np.uint8))
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
            masks[color] = mask

        # Debug prints
        print("--- SECTION ---")
        print("HSV Sample:", hsv_section[::10, ::10].reshape(-1, 3)[:16])
        print(">> Masks created for:", [k for k, v in masks.items() if np.count_nonzero(v) > 0])

        color_counts = {color: np.count_nonzero(mask) for color, mask in masks.items()}
        color_counts = {color: count for color, count in color_counts.items() if count > 20}

        print("Color pixel counts:", color_counts)

        return max(color_counts, key=color_counts.get) if color_counts else None

    for sec in horizontal_sections:
        hsv = cv2.cvtColor(sec, cv2.COLOR_BGR2HSV)
        detected = detect_color(sec, hsv)
        if detected:
            detected_colors.append(detected)

    majority_color = Counter(detected_colors).most_common(1)[0][0] if detected_colors else None
    print(">>> Majority Detected Color:", majority_color)
    return majority_color

# ====================== pH Mapping ======================
color_pH_mapping = {
    "magenta": 3.0,
    "purple": 6.0,
    "blue": 8.0,
    "green": 9.0,
    "yellow": 12.0
}

health_findings = {
    3.0: "Acidic pH: Possible respiratory distress.",
    6.0: "Slightly acidic pH: May indicate metabolic issues.",
    8.0: "Neutral pH: Generally normal.",
    9.0: "Alkaline pH: Could indicate alkalosis.",
    12.0: "Strongly alkaline: Could suggest imbalances."
}

# ====================== API Endpoint ======================
@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    npimg = np.frombuffer(file.read(), np.uint8)
    image1 = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    image = image1[240:400, 400:450]  # Crop
    print("Cropped image shape:", image.shape)

    if image is None:
        return jsonify({"error": "Invalid image format"}), 400

    image_corrected = preprocess_image(image)
    detected_color = split_and_detect(image_corrected)

    detected_pH = color_pH_mapping.get(detected_color, "Unknown")
    health_message = health_findings.get(detected_pH, "No specific health issue detected.")

    return jsonify({
        "detected_pH": detected_pH,
        "health_message": health_message
    })

if __name__ == "__main__":
    app.run(host="192.168.1.130", port=5000, debug=True)
