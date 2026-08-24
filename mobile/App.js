import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";

// akademi.biz.tr — Expo MVP
// Kamera: soru fotoğrafı çek -> /api/ai/chat (vision)
// Ses: kayıt -> transcribe -> AI klon
// LiveKit: canlı derse katıl (react-native-webrtc)

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [aiAnswer, setAiAnswer] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, base64: true });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      // TODO: POST https://akademi.biz.tr/api/ai/chat { cloneId, message: "Bu soruyu çöz", imageBase64: res.assets[0].base64, wantAudio: true }
      setAiAnswer("Demo: Fotoğraf alındı. Gerçek AI bağlantısı için API_URL ayarlayın. Klon sesle çözecek (OpenRouter vision + TTS).");
    }
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }
    Alert.alert("Kamera", "Kamera önizleme LiveKit ve soru çekme için hazır. Bu demo'da galeriden seçin.");
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (e) {
      Alert.alert("Ses hatası", String(e));
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setAiAnswer(`Demo: Ses kaydedildi (${uri}). STT -> AI klon -> TTS akışı burada çalışacak (OpenRouter Whisper + gpt-4o-mini-tts).`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>akademi.biz.tr</Text>
        <Text style={styles.subtitle}>LGS & YKS • AI Öğretmen Klonu • Mobil</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📷 Soru Fotoğrafı → AI Klon Çözsün</Text>
          <Text style={styles.cardDesc}>Kamera ile çek veya galeriden seç. Klon beyaz tahtada sesle çözer.</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnPrimary} onPress={pickImage}>
              <Text style={styles.btnText}>Galeriden Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={takePhoto}>
              <Text style={styles.btnTextDark}>Kamera</Text>
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.preview} />}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎙️ Sesli Soru → Klon Sesle Cevap</Text>
          <Text style={styles.cardDesc}>Basılı tut, sor, klon öğretmeninin sesiyle cevaplasın.</Text>
          <TouchableOpacity
            style={[styles.btnPrimary, recording && styles.btnRecording]}
            onPress={recording ? stopRecording : startRecording}
          >
            <Text style={styles.btnText}>{recording ? "⏹ Durdur ve Gönder" : "🎙️ Kayda Başla"}</Text>
          </TouchableOpacity>
        </View>

        {aiAnswer ? (
          <View style={styles.cardAI}>
            <Text style={styles.cardTitle}>🤖 AI Klon Cevabı (2 kredi)</Text>
            <Text style={styles.aiText}>{aiAnswer}</Text>
            <Text style={styles.small}>Her etkileşim öğretmene hakediş yazılır • Kredi düşülür</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎥 Canlı Ders (max 10 kişi)</Text>
          <Text style={styles.cardDesc}>LiveKit — düşük gecikme, Cloudflare Tunnel arkasında. Sınıf koduyla katıl.</Text>
          <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert("Canlı Ders", "LiveKit RN entegrasyonu: room token /api/livekit/token -> LiveKitRoom")}>
            <Text style={styles.btnTextDark}>Canlı Derse Katıl</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© akademi.biz.tr • KVKK uyumlu • Ses klon izni ile • Iyzico/PayTR/Stripe</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  scroll: { padding: 20, gap: 16, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 13, color: "#71717a", textAlign: "center", marginTop: -12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e4e4e7", gap: 8 },
  cardAI: { backgroundColor: "#f5f3ff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#ddd6fe", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardDesc: { fontSize: 12, color: "#71717a" },
  row: { flexDirection: "row", gap: 8, marginTop: 8 },
  btnPrimary: { flex: 1, backgroundColor: "#18181b", padding: 14, borderRadius: 12, alignItems: "center" },
  btnOutline: { flex: 1, backgroundColor: "#fff", padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#e4e4e7" },
  btnRecording: { backgroundColor: "#dc2626" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnTextDark: { color: "#18181b", fontWeight: "700", fontSize: 13 },
  preview: { width: "100%", height: 180, borderRadius: 12, marginTop: 8, backgroundColor: "#f4f4f5" },
  aiText: { fontSize: 13, color: "#27272a", lineHeight: 18 },
  small: { fontSize: 11, color: "#71717a" },
  footer: { fontSize: 11, color: "#a1a1aa", textAlign: "center", marginTop: 8 },
});
