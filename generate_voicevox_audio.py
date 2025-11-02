import requests
import json
import os

# Voicevox Engine API エンドポイント
VOICEVOX_API_URL = "http://localhost:50021"
SPEAKER_ID = 10 # 新しい話者ID: 10 に設定
SPEED_SCALE = 0.85 # 再生速度 0.85倍

# organCareGuides のデータをPythonの辞書として定義
organ_care_guides_data = {
    # ... (省略) ...
}

massage_guides_data = {
    # ... (省略) ...
}

stretch_guides_data = {
    "shoulder-pain": {
        "scripts": [
            "両手を後ろで組み、肩甲骨を寄せるように胸を張ります。ゆっくりと深呼吸しながら20秒キープしましょう。",
            "左手を頭の上に回し、ゆっくりと首を右に倒して20秒キープします。",
            "右手を頭の上に回し、ゆっくりと首を左に倒して20秒キープします。",
        ]
    },
    "back-pain": {
        "scripts": [
            "椅子に浅く座り、右足首を左膝に乗せます。上体をゆっくりと前に倒し、お尻の伸びを感じながら30秒キープします。",
            "椅子に浅く座り、左足首を右膝に乗せます。上体をゆっくりと前に倒し、お尻の伸びを感じながら30秒キープします。",
            "片方の腕を上げて、ゆっくりと体を横に倒します。体側が伸びるのを感じながら20秒キープします。反対側も同様に行います。",
        ]
    },
    "eye-strain": {
        "scripts": [
            "両手の親指で眉毛の下の骨のくぼみを優しく指圧します。ゆっくりと円を描くように15秒間マッサージします。",
            "人差し指と中指で、目の周りの骨に沿って優しくマッサージします。内側から外側へ、ゆっくりと30秒間行います。",
            "指を立てて顔の前に置き、指先と遠くの景色を交互に5秒ずつ見つめます。これを3回繰り返しましょう。",
        ]
    }
}

def synthesize_and_save(text: str, filename: str, speaker_id: int) -> bool:
    audio_query_params = {
        "text": text,
        "speaker": speaker_id,
        "volumeScale": 2.0,
        "intonationScale": 1.3
    }

    try:
        audio_query_response = requests.post(f"{VOICEVOX_API_URL}/audio_query", params=audio_query_params)
        audio_query_response.raise_for_status()
        audio_query = audio_query_response.json()
    except requests.exceptions.RequestException as error:
        print(f"Audio query error for {filename}: {error}")
        return False

    audio_query["speedScale"] = SPEED_SCALE

    synthesis_params = {
        "speaker": speaker_id,
        "outputSamplingRate": 44100
    }

    try:
        synthesis_response = requests.post(
            f"{VOICEVOX_API_URL}/synthesis",
            params=synthesis_params,
            json=audio_query
        )
        synthesis_response.raise_for_status()
    except requests.exceptions.RequestException as error:
        print(f"Synthesis error for {filename}: {error}")
        return False

    with open(filename, "wb") as file:
        file.write(synthesis_response.content)

    return True


def generate_category_audio(category: str, guides: dict, speaker_id: int):
    output_dir = os.path.join("public", "audio", category)
    os.makedirs(output_dir, exist_ok=True)

    for key, guide in guides.items():
        for index, text in enumerate(guide["scripts"]):
            filename = os.path.join(output_dir, f"{key}_step{index + 1}.wav")
            if synthesize_and_save(text, filename, speaker_id):
                print(f"Generated {filename}")

# generate_category_audio("organ-care", organ_care_guides_data, 46) # 内臓ケアは完了
# generate_category_audio("massage", massage_guides_data, 14) # マッサージは完了
generate_category_audio("stretch", stretch_guides_data, SPEAKER_ID)

print("Stretch audio files generated.")
