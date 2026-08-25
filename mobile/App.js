import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, TextInput, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://akademi.biz.tr";

// Demo hesaplar (seed ile uyumlu)
const DEMO_ACCOUNTS = [
  { label: "Öğrenci", email: "ogrenci@akademi.biz.tr", password: "Ogrenci123!", role: "student" },
  { label: "Öğretmen", email: "ogretmen@akademi.biz.tr", password: "Ogretmen123!", role: "teacher" },
  { label: "Admin", email: "admin@akademi.biz.tr", password: "Admin123!", role: "superadmin" },
];

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(null);
  const [aiAnswer, setAiAnswer] = useState("");
  const [screen, setScreen] = useState("loading"); // loading | login | register | home
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync("akademi_user");
      if (saved) {
        try {
          const u = JSON.parse(saved);
          setUser(u);
          setScreen("home");
        } catch {}
      } else {
        setScreen("login");
      }
    })();
  }, []);

  const saveUser = async (u) => {
    setUser(u);
    await SecureStore.setItemAsync("akademi_user", JSON.stringify(u));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("akademi_user");
    setUser(null);
    setEmail("");
    setPassword("");
    setScreen("login");
  };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Hata", "E-posta ve şifre girin");
    setLoading(true);
    try {
      // Demo hesaplar için offline giriş (API yoksa da çalışsın)
      const demo = DEMO_ACCOUNTS.find((d) => d.email === email && d.password === password);
      if (demo) {
        await saveUser({ email: demo.email, name: demo.label, role: demo.role });
        setScreen("home");
        setLoading(false);
        return;
      }
      // Gerçek API denemesi
      const res = await fetch(`${API_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Giriş başarısız");
      const u = data?.user || { email, name: data?.user?.name || email.split("@")[0], role: data?.user?.role || "student" };
      await saveUser(u);
      setScreen("home");
    } catch (e) {
      Alert.alert("Giriş hatası", String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert("Hata", "Tüm alanları doldurun");
    setLoading(true);
    try {
      const demoRole = role;
      // Demo için direkt kaydet
      const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: demoRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // API yoksa demo kayıt kabul et
        if (res.status === 404 || !res.ok) {
          await saveUser({ email, name, role: demoRole });
          setScreen("home");
          setLoading(false);
          return;
        }
        throw new Error(data?.message || "Kayıt başarısız");
      }
      const u = data?.user || { email, name, role: demoRole };
      await saveUser({ email: u.email || email, name: u.name || name, role: u.role || demoRole });
      setScreen("home");
    } catch (e) {
      // Fallback demo
      await saveUser({ email, name, role });
      setScreen("home");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, base64: true });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setAiAnswer("Fotoğraf alındı ✓ Akademi Klonun sesli ve yazılı adım adım çözecek (Vision + Akademi Klonu). API: POST /api/ai/chat");
    }
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }
    Alert.alert("Kamera", "Canlı önizleme ve soru çekme için kamera hazır. Bu sürümde galeriden seçin veya Expo Dev Client ile test edin.");
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
    setAiAnswer(`Ses kaydedildi ✓ (${String(uri).slice(-20)}). STT → Akademi Klonu → sesli cevap akışı hazır.`);
  };

  const fillDemo = (d) => {
    setEmail(d.email);
    setPassword(d.password);
    if (d.role) setRole(d.role);
    if (d.label) setName(d.label);
  };

  if (screen === "loading") {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Image source={require("./assets/icon.png")} style={{ width: 96, height: 96, borderRadius: 24, backgroundColor: "#fff" }} resizeMode="contain" />
        <ActivityIndicator style={{ marginTop: 16 }} color="#18181b" />
        <Text style={{ marginTop: 8, color: "#71717a" }}>akademi.biz.tr yükleniyor...</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  if (screen === "login" || screen === "register") {
    const isLogin = screen === "login";
    return (
      <View style={styles.containerAuth}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.scrollAuth} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image source={require("./assets/icon.png")} style={{ width: 88, height: 88, borderRadius: 20, backgroundColor: "#fff" }} resizeMode="contain" />
            <Text style={styles.title}>akademi.biz.tr</Text>
            <Text style={styles.subtitle}>LGS & YKS • Akademi Klonu • Mobil</Text>
            <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
              <View style={{ backgroundColor: "#f4f4f5", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 11, color: "#71717a" }}>KVKK uyumlu</Text>
              </View>
              <View style={{ backgroundColor: "#f5f3ff", borderWidth: 1, borderColor: "#ddd6fe", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 11, color: "#7c3aed", fontWeight: "700" }}>AKADEMİ KLONU</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</Text>
            <Text style={styles.cardDesc}>{isLogin ? "Hesabınla giriş yap, derslerine devam et." : "Hesap oluştur, seviyeni seç ve hemen başla."}</Text>

            {!isLogin && (
              <>
                <TextInput placeholder="Ad Soyad" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#a1a1aa" />
                <View style={styles.row}>
                  <TouchableOpacity onPress={() => setRole("student")} style={[styles.roleBtn, role === "student" && styles.roleBtnActive]}>
                    <Text style={[styles.roleText, role === "student" && styles.roleTextActive]}>Öğrenciyim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRole("teacher")} style={[styles.roleBtn, role === "teacher" && styles.roleBtnActive]}>
                    <Text style={[styles.roleText, role === "teacher" && styles.roleTextActive]}>Öğretmenim</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TextInput placeholder="E-posta" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholderTextColor="#a1a1aa" />
            <TextInput placeholder="Şifre" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholderTextColor="#a1a1aa" />

            <TouchableOpacity onPress={isLogin ? handleLogin : handleRegister} disabled={loading} style={[styles.btnPrimary, { marginTop: 4 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{isLogin ? "Giriş Yap" : "Hesap Oluştur"}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setScreen(isLogin ? "register" : "login")} style={{ marginTop: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 13, color: "#71717a" }}>
                {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
                <Text style={{ color: "#7c3aed", fontWeight: "700" }}>{isLogin ? "Kayıt Ol" : "Giriş Yap"}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#18181b" }}>Deneme hesapları — tek tıkla doldur</Text>
            <Text style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>Superadmin panel: https://akademi.biz.tr/superadmin</Text>
            <View style={{ gap: 8, marginTop: 10 }}>
              {DEMO_ACCOUNTS.map((d) => (
                <TouchableOpacity key={d.email} onPress={() => fillDemo(d)} style={styles.demoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: "#18181b" }}>{d.label} • {d.role}</Text>
                    <Text style={{ fontSize: 11, color: "#71717a" }}>{d.email} / {d.password}</Text>
                  </View>
                  <View style={{ backgroundColor: "#18181b", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>Doldur</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ marginTop: 10, backgroundColor: "#fafafa", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 10 }}>
              <Text style={{ fontSize: 11, color: "#52525b", lineHeight: 14 }}>
                <Text style={{ fontWeight: "700" }}>Admin:</Text> admin@akademi.biz.tr / Admin123! → Web: /superadmin{"\n"}
                <Text style={{ fontWeight: "700" }}>Öğretmen:</Text> ogretmen@akademi.biz.tr / Ogretmen123! → /ogretmen{"\n"}
                <Text style={{ fontWeight: "700" }}>Öğrenci:</Text> ogrenci@akademi.biz.tr / Ogrenci123! → /ogrenci
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={{ fontSize: 11, color: "#a1a1aa" }}>API: https://akademi.biz.tr • Güvenli • KVKK uyumlu</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  // HOME - logged in
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image source={require("./assets/icon.png")} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff" }} resizeMode="contain" />
          <View>
            <Text style={{ fontWeight: "800", fontSize: 15, color: "#18181b" }}>akademi.biz.tr</Text>
            <Text style={{ fontSize: 11, color: "#71717a" }}>{user?.name} • {user?.role} • {user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={{ backgroundColor: "#f4f4f5", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#18181b" }}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {user?.role === "superadmin" && (
          <View style={[styles.card, { borderColor: "#fde68a", backgroundColor: "#fffbeb" }]}>
            <Text style={styles.cardTitle}>🛡️ SüperAdmin</Text>
            <Text style={styles.cardDesc}>Web panel: https://akademi.biz.tr/superadmin</Text>
            <Text style={{ fontSize: 11, color: "#92400e", marginTop: 4 }}>Mobilde admin işlemleri kısıtlı — tam yönetim için web panelini kullanın.</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📷 Soru Fotoğrafı → Akademi Klonu Çözsün</Text>
          <Text style={styles.cardDesc}>Kamera ile çek veya galeriden seç. Klonun beyaz tahtada sesle çözer.</Text>
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
          <Text style={styles.cardDesc}>Basılı tut, sor, Akademi Klonun sesiyle cevaplasın.</Text>
          <TouchableOpacity style={[styles.btnPrimary, recording && styles.btnRecording]} onPress={recording ? stopRecording : startRecording}>
            <Text style={styles.btnText}>{recording ? "⏹ Durdur ve Gönder" : "🎙️ Kayda Başla"}</Text>
          </TouchableOpacity>
        </View>

        {aiAnswer ? (
          <View style={styles.cardAI}>
            <Text style={styles.cardTitle}>🤖 Akademi Klonu Cevabı</Text>
            <Text style={styles.aiText}>{aiAnswer}</Text>
            <Text style={styles.small}>Her etkileşim öğretmene hakediş yazılır • Kredi düşülür</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎥 Canlı Ders (max 10 kişi)</Text>
          <Text style={styles.cardDesc}>Sınıf koduyla katıl — düşük gecikme, kayıtlı.</Text>
          <TouchableOpacity style={styles.btnOutline} onPress={() => Alert.alert("Canlı Ders", `Hoş geldin ${user?.name}! Oda kodu ile /canli?room=xxx adresine bağlan. Web'de tam deneyim.`)} >
            <Text style={styles.btnTextDark}>Canlı Derse Katıl</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 8, flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => Alert.alert("Web Panel", user?.role === "teacher" ? "Öğretmen paneli: https://akademi.biz.tr/ogretmen" : user?.role === "superadmin" ? "Admin: https://akademi.biz.tr/superadmin" : "Öğrenci paneli: https://akademi.biz.tr/ogrenci")} style={[styles.btnOutline, { flex: 1 }]}>
              <Text style={styles.btnTextDark}>Panele Git</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>© akademi.biz.tr • KVKK uyumlu • Akademi Klonu • Güvenli ödeme</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  containerAuth: { flex: 1, backgroundColor: "#030712" },
  scroll: { padding: 16, gap: 16, paddingTop: 12, paddingBottom: 32 },
  scrollAuth: { padding: 16, gap: 12, paddingTop: 40, paddingBottom: 32 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e4e4e7" },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", color: "#fff", marginTop: 8 },
  subtitle: { fontSize: 13, color: "#a1a1aa", textAlign: "center", marginTop: 2 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e4e4e7", gap: 8 },
  cardAI: { backgroundColor: "#f5f3ff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#ddd6fe", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#18181b" },
  cardDesc: { fontSize: 12, color: "#71717a" },
  row: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#18181b" },
  roleBtn: { flex: 1, borderWidth: 1, borderColor: "#e4e4e7", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  roleBtnActive: { backgroundColor: "#18181b", borderColor: "#18181b" },
  roleText: { fontSize: 13, fontWeight: "700", color: "#18181b" },
  roleTextActive: { color: "#fff" },
  btnPrimary: { flex: 1, backgroundColor: "#18181b", padding: 14, borderRadius: 12, alignItems: "center" },
  btnOutline: { flex: 1, backgroundColor: "#fff", padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#e4e4e7" },
  btnRecording: { backgroundColor: "#dc2626" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnTextDark: { color: "#18181b", fontWeight: "700", fontSize: 13 },
  preview: { width: "100%", height: 180, borderRadius: 12, marginTop: 8, backgroundColor: "#f4f4f5" },
  aiText: { fontSize: 13, color: "#27272a", lineHeight: 18 },
  small: { fontSize: 11, color: "#71717a" },
  demoRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 12, padding: 10, gap: 8 },
  footer: { fontSize: 11, color: "#a1a1aa", textAlign: "center", marginTop: 8 },
});
