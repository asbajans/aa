export default function KVKKPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-zinc">
      <h1>KVKK Aydınlatma Metni & Açık Rıza (v1.0)</h1>
      <p><strong>Veri Sorumlusu:</strong> akademi.biz.tr</p>
      <h2>1. Toplanan Veriler</h2>
      <ul><li>Kimlik, iletişim, eğitim bilgileri (LGS/YKS seviyesi)</li><li>Ses örneği (sadece öğretmen, açık rıza ile) — şifrelenmiş saklanır</li><li>Ders kayıtları, mesajlar, ödemeler</li></ul>
      <h2>2. Ses Klonlama Açık Rıza Metni</h2>
      <p>“Sesimin, yalnızca kendi AI klonumun oluşturulması ve öğrencilerle etkileşimi için işlenmesine, saklanmasına ve TTS sağlayıcısına (OpenRouter/ElevenLabs) aktarılmasına açık rıza veriyorum. Dilediğim an klonumu durdurabilir, ses verimin silinmesini talep edebilirim. Klonum SuperAdmin onayı olmadan yayına alınmaz.”</p>
      <h2>3. Haklar</h2>
      <p>KVKK 11. madde haklarınız saklıdır. Başvuru: kvkk@akademi.biz.tr</p>
      <h2>4. Güvenlik Önlemleri</h2>
      <ul><li>Ses dosyaları S3/R2’de şifreli, voice_id ile eşlenir</li><li>Moderasyon: klon içerikleri loglanır, halüsinasyon için RAG guardrail</li><li>Ban / içerik şikayet hattı</li></ul>
    </div>
  );
}
