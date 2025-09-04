

// // // ajanda.js (tam düzeltilmiş ve geliştirilmiş sürüm)
// // // -----------------------------------------------------------------------------
// // // Bu dosya, hafta/ay görünümü arasında geçiş yapabilen, Pazartesi başlangıçlı
// // // takvim ızgarası ve öğrenci/randevu listeleri olan Ajanda ekranını içerir.
// // //
// // // 🔧 Ana düzeltmeler:
// // // 1) Takvim ızgarası tam 7 sütun (Pazar dahil) gösterecek şekilde düzeltildi
// // // 2) Ay/Hafta görünümü arasında switch ile geçiş eklendi
// // // 3) Yeni randevu butonu seçili tarihi "ajandaKayitEkle" sayfasına prop olarak gönderiyor
// // // 4) Tüm matematiksel hesaplamalar ve React hook kullanımları açıklandı
// // // -----------------------------------------------------------------------------

// // import React, { useState, useEffect } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     FlatList,
// //     Modal,
// //     TouchableWithoutFeedback,
// //     Dimensions,
// //     ActivityIndicator,
// //     Switch,
// // } from 'react-native';
// // import { useNavigation, useIsFocused } from '@react-navigation/native';
// // import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// // import { ogrencileriListele } from '../utils/database';
// // import { gunlukAjandaGetir } from '../utils/ajandaDatabase';

// // // 📐 Ekran genişliği hesaplaması
// // // Dimensions.get('window').width: cihazın tam ekran genişliği
// // // - 30: sol ve sağ padding (15+15)
// // // / 7: haftanın 7 günü için eşit bölüştür
// // const { width } = Dimensions.get('window');
// // const CELL_WIDTH = (width - 30) / 7;

// // // 📅 Haftanın gün isimleri (Pazartesi başlangıçlı)
// // // Bu dizi hem başlık satırında hem de gün hesaplamalarında kullanılır
// // const DAY_NAMES = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

// // // 🔄 JavaScript Date.getDay() dönüştürücü fonksiyon
// // // JS'de: 0=Pazar, 1=Pazartesi, 2=Salı... 6=Cumartesi
// // // Bizim istediğimiz: 0=Pazartesi, 1=Salı... 6=Pazar
// // // Formül: Pazar(0) -> 6'ya çevir, diğerleri 1 eksilt
// // const getDayIndex = (date) => {
// //     const jsDay = date.getDay(); // JavaScript'in orijinal günü
// //     return jsDay === 0 ? 6 : jsDay - 1;
// // };

// // // 📆 Verilen tarihten o haftanın Pazartesi'sini bulan fonksiyon
// // // Örnek: Çarşamba verilirse, o haftanın Pazartesi'sini döndürür
// // const getMonday = (date) => {
// //     const dayIndex = getDayIndex(date); // Pazartesi=0 bazında gün indeksi
// //     const monday = new Date(date); // Orijinal tarihi kopyala
// //     monday.setDate(date.getDate() - dayIndex); // Geri git ve Pazartesi'yi bul
// //     return monday;
// // };




// // export default function Ajanda() {
// //     // 🧭 React Navigation hook'u
// //     // useNavigation(): başka sayfalara geçiş yapabilmek için navigation objesi döndürür
// //     const navigation = useNavigation();

// //     // 👁️ Sayfa odak durumu hook'u  
// //     // useIsFocused(): bu sayfa aktif/görünür olduğunda true döndürür
// //     // Genellikle sayfa geri geldiğinde veri tazelemek için kullanılır
// //     const isFocused = useIsFocused();

// //     // 🏪 React State (useState hook) tanımlamaları
// //     // useState(başlangıçDeğer): [değer, değerDeğiştirFonksiyonu] döndürür
// //     const [selectedDate, setSelectedDate] = useState(new Date()); // Seçili tarih
// //     const [currentMonth, setCurrentMonth] = useState(new Date()); // Ay görünümündeki ay
// //     const [currentWeek, setCurrentWeek] = useState(getMonday(new Date())); // Hafta görünümündeki hafta
// //     const [isWeekView, setIsWeekView] = useState(false); // Hafta mı ay mı görünümü
// //     const [showOgrenciList, setShowOgrenciList] = useState(false); // Öğrenci modal'ının açık/kapalı durumu
// //     const [randevular, setRandevular] = useState([]); // Seçili günün randevu listesi
// //     const [ogrenciler, setOgrenciler] = useState([]); // Tüm öğrenci listesi
// //     const [calendarDays, setCalendarDays] = useState([]); // Takvimde gösterilecek günler
// //     const [loading, setLoading] = useState(true); // Yüklenme durumu

// //     // 🔄 useEffect Hook'ları
// //     // useEffect(fonksiyon, bağımlılıkDizisi): bağımlılık değiştiğinde fonksiyonu çalıştırır
// //     // [] boş dizi: sadece component ilk yüklendiğinde çalıştır
// //     // [değişken]: o değişken değiştiğinde çalıştır

// //     // Takvim görünümü değiştiğinde günleri yeniden hesapla
// //     useEffect(() => {
// //         if (isWeekView) {
// //             generateWeekDays(); // Hafta görünümü için 7 gün
// //         } else {
// //             generateCalendarDaysMonth(); // Ay görünümü için 42 gün
// //         }
// //     }, [currentMonth, currentWeek, isWeekView]);

// //     // Sayfa odaklandığında öğrenci listesini tazele
// //     useEffect(() => {
// //         if (isFocused) {
// //             fetchOgrenciler();
// //         }
// //     }, [isFocused]);

// //     // 🔗 Asenkron fonksiyon: Veritabanından öğrenci listesi çekme
// //     // async/await: Promise tabanlı asenkron işlemler için modern JS syntaxı
// //     // try/catch: hata yakalama bloğu
// //     const fetchOgrenciler = async () => {
// //         try {
// //             setLoading(true); // Yüklenme başladı
// //             const result = await ogrencileriListele(false); // DB fonksiyonunu bekle
// //             // Optional chaining (?.): result null/undefined ise hata vermez
// //             if (result?.success) {
// //                 // Logical OR (||): sol taraf falsy ise sağ tarafı kullan
// //                 setOgrenciler(result.data || []);
// //             }
// //         } catch (error) {
// //             // console.error: hataları konsola yazdır (geliştirme amaçlı)
// //             console.error('Öğrenci listesi alınamadı:', error);
// //         } finally {
// //             // finally bloğu: hata olsun olmasın her durumda çalışır
// //             setLoading(false); // Yüklenme bitti
// //         }
// //     };

// //     // 📅 AY GÖRÜNÜMÜ: 42 hücrelik (6 hafta x 7 gün) takvim ızgarası oluşturma
// //     // Bu fonksiyon, bir ayın tüm günlerini + önceki/sonraki aydan eksik günleri
// //     // toplamda 42 hücre olacak şekilde hesaplar
// //     const generateCalendarDaysMonth = () => {
// //         // Date objesi metodları:
// //         // getFullYear(): 2024 gibi 4 haneli yıl
// //         // getMonth(): 0-11 arası ay indeksi (0=Ocak, 11=Aralık)
// //         const year = currentMonth.getFullYear();
// //         const month = currentMonth.getMonth();

// //         // new Date(yıl, ay, gün) constructor'ı:
// //         // - gün=1: ayın ilk günü
// //         // - gün=0: önceki ayın son günü (JavaScript özelliği)
// //         const firstDay = new Date(year, month, 1); // Bu ayın 1'i
// //         const lastDay = new Date(year, month + 1, 0); // Bu ayın son günü

// //         // getDayIndex: kendi yazdığımız fonksiyon (Pazartesi=0 bazında)
// //         const firstDayIndex = getDayIndex(firstDay);

// //         const days = []; // Sonuç dizisi
// //         const today = new Date(); // Bugünün tarihi

// //         // 1️⃣ ÖNCEKİ AYDAN GÜNLER
// //         // Eğer ayın 1'i Çarşamba ise (index=2), başa 2 gün eklememiz gerekir
// //         // Önceki ayın son günü: new Date(year, month, 0).getDate()
// //         const prevMonthLastDate = new Date(year, month, 0).getDate();
// //         for (let i = firstDayIndex; i > 0; i--) {
// //             // Geriye doğru say: prevMonthLastDate-1, prevMonthLastDate-2, ...
// //             const date = new Date(year, month - 1, prevMonthLastDate - i + 1);
// //             days.push({
// //                 date,
// //                 isCurrentMonth: false, // Mevcut ay değil
// //                 isToday: false, // Önceki ay olduğu için bugün olamaz
// //                 hasEvent: Math.random() > 0.85, // Demo: düşük olasılıkla etkinlik
// //             });
// //         }

// //         // 2️⃣ BU AYDAN GÜNLER
// //         // 1'den son güne kadar tüm günleri ekle
// //         for (let d = 1; d <= lastDay.getDate(); d++) {
// //             const date = new Date(year, month, d);
// //             days.push({
// //                 date,
// //                 isCurrentMonth: true,
// //                 // toDateString(): tarih karşılaştırması (saat olmadan)
// //                 // "Mon Aug 31 2025" formatında string döndürür
// //                 isToday: date.toDateString() === today.toDateString(),
// //                 hasEvent: Math.random() > 0.5, // Demo: %50 olasılık
// //             });
// //         }

// //         // 3️⃣ SONRAKİ AYDAN GÜNLER
// //         // Toplam 42 hücre olacak şekilde kalan yerleri doldur
// //         const totalCells = 42; // 6 hafta x 7 gün = 42
// //         const remainingCells = totalCells - days.length;
// //         for (let i = 1; i <= remainingCells; i++) {
// //             const date = new Date(year, month + 1, i);
// //             days.push({
// //                 date,
// //                 isCurrentMonth: false,
// //                 isToday: false,
// //                 hasEvent: Math.random() > 0.85, // Demo
// //             });
// //         }

// //         setCalendarDays(days);
// //     };

// //     // 📅 HAFTA GÖRÜNÜMÜ: 7 günlük sıralı liste oluşturma
// //     // currentWeek state'inde tutulan Pazartesi'den başlayarak 7 gün üret
// //     const generateWeekDays = () => {
// //         const days = [];
// //         const today = new Date();

// //         // for döngüsü: 0'dan 6'ya kadar (7 gün)
// //         for (let i = 0; i < 7; i++) {
// //             // new Date(currentWeek): mevcut hafta Pazartesi'sini kopyala
// //             // setDate(): gün sayısını değiştir (i gün sonrasını al)
// //             const date = new Date(currentWeek);
// //             date.setDate(currentWeek.getDate() + i);

// //             days.push({
// //                 date,
// //                 isCurrentMonth: true, // Hafta görünümünde hep true
// //                 isToday: date.toDateString() === today.toDateString(),
// //                 hasEvent: Math.random() > 0.5, // Demo
// //             });
// //         }

// //         setCalendarDays(days);
// //     };

// //     // 🗓️ Ay formatlaması fonksiyonu
// //     // toLocaleDateString(): tarih formatlaması için JavaScript metodu
// //     // 'tr-TR': Türkçe locale (yerel ayar)
// //     // options objesi: hangi parçaların gösterileceğini belirler
// //     const formatMonth = (date) =>
// //         date.toLocaleDateString('tr-TR', {
// //             month: 'long',  // "Ağustos" (uzun format)
// //             year: 'numeric' // "2025" (sayısal)
// //         });

// //     // 📆 Hafta formatlaması fonksiyonu  
// //     // Haftanın ilk ve son günlerini göster: "1-7 Ağustos 2025"
// //     const formatWeek = (mondayDate) => {
// //         const sunday = new Date(mondayDate);
// //         sunday.setDate(mondayDate.getDate() + 6); // 6 gün sonrası = Pazar

// //         // İki tarih aynı ay içindeyse
// //         if (mondayDate.getMonth() === sunday.getMonth()) {
// //             return `${mondayDate.getDate()}-${sunday.getDate()} ${formatMonth(mondayDate)}`;
// //         } else {
// //             // Farklı aylardaysa her ikisini de göster
// //             return `${mondayDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${sunday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
// //         }
// //     };

// //     // ⬅️➡️ Ay değiştirme fonksiyonu
// //     // direction parametresi: -1 (önceki ay) veya +1 (sonraki ay)
// //     const changeMonth = (direction) => {
// //         const nextMonth = new Date(currentMonth); // Mevcut ayı kopyala
// //         nextMonth.setMonth(nextMonth.getMonth() + direction); // Ay ekle/çıkar
// //         setCurrentMonth(nextMonth); // State'i güncelle

// //         // Seçili tarih, yeni ay içinde değilse, ayın 1'ini seç
// //         if (selectedDate.getMonth() !== nextMonth.getMonth() ||
// //             selectedDate.getFullYear() !== nextMonth.getFullYear()) {
// //             setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
// //         }
// //     };

// //     // ⬅️➡️ Hafta değiştirme fonksiyonu
// //     // direction: -1 (önceki hafta) veya +1 (sonraki hafta)
// //     const changeWeek = (direction) => {
// //         const nextWeek = new Date(currentWeek); // Mevcut hafta Pazartesi'sini kopyala
// //         nextWeek.setDate(currentWeek.getDate() + (direction * 7)); // 7 gün ekle/çıkar
// //         setCurrentWeek(nextWeek);

// //         // Seçili günü de aynı yönde kaydır
// //         const newSelectedDate = new Date(selectedDate);
// //         newSelectedDate.setDate(selectedDate.getDate() + (direction * 7));
// //         setSelectedDate(newSelectedDate);
// //     };

// //     // 🔀 Görünüm değiştirme fonksiyonu (Switch component için)
// //     // value parametresi: Switch'in yeni değeri (true=hafta, false=ay)
// //     const toggleView = (value) => {
// //         setIsWeekView(value);

// //         if (value) {
// //             // Hafta görünümüne geçiş: seçili günü içeren haftanın Pazartesi'sini bul
// //             setCurrentWeek(getMonday(selectedDate));
// //         } else {
// //             // Ay görünümüne geçiş: seçili günün ayını mevcut ay yap
// //             setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
// //         }
// //     };

// //     // 👆 Gün seçme fonksiyonu
// //     // day parametresi: renderCalendarDay fonksiyonundan gelen gün objesi
// //     const selectDay = (day) => {
// //         setSelectedDate(day.date); // Seçili tarihi güncelle

// //         // TODO: Gerçek uygulamada burada seçilen günün randevularını çekebilirsiniz
// //         // fetchRandevularForDate(day.date);

// //         // Demo amaçlı rastgele randevu listesi
// //         setRandevular([
// //             {
// //                 id: 1,
// //                 saat: '14:00',
// //                 ogrenciAdi: 'Ahmet Yılmaz',
// //                 ders: 'Matematik',
// //                 tamamlandi: false
// //             },
// //             {
// //                 id: 2,
// //                 saat: '16:00',
// //                 ogrenciAdi: 'Ayşe Demir',
// //                 ders: 'Fizik',
// //                 tamamlandi: true
// //             }
// //         ]);
// //     };

// //     // 🎨 FlatList renderItem fonksiyonu: Randevu listesi
// //     // FlatList'te her öğe için bu fonksiyon çağrılır
// //     // { item }: destructuring syntax - sadece item özelliğini al
// //     const renderRandevuItem = ({ item }) => (
// //         <View style={[
// //             styles.randevuItem,
// //             // Conditional styling: tamamlandıysa farklı stil uygula
// //             item.tamamlandi && styles.tamamlandiItem
// //         ]}>
// //             {/* Randevu saati kutusu */}
// //             <View style={styles.randevuSaat}>
// //                 <Text style={styles.randevuSaatText}>{item.saat}</Text>
// //             </View>

// //             {/* Öğrenci ve ders bilgisi */}
// //             <View style={styles.randevuBilgi}>
// //                 <Text style={styles.randevuOgrenci}>{item.ogrenciAdi}</Text>
// //                 <Text style={styles.randevuDers}>{item.ders}</Text>
// //             </View>

// //             {/* Durum ikonu */}
// //             <View style={styles.randevuDurum}>
// //                 {item.tamamlandi ? (
// //                     <MaterialIcons name="check-circle" size={24} color="#27ae60" />
// //                 ) : (
// //                     <MaterialIcons name="schedule" size={24} color="#f39c12" />
// //                 )}
// //             </View>
// //         </View>
// //     );

// //     // 🎨 FlatList renderItem fonksiyonu: Öğrenci listesi
// //     const renderOgrenciItem = ({ item }) => (
// //         <TouchableOpacity
// //             style={styles.ogrenciItem}
// //             onPress={() => setShowOgrenciList(false)} // Modal'ı kapat
// //         >
// //             {/* Template literal (`): string içine değişken gömme */}
// //             <Text style={styles.ogrenciText}>
// //                 {item.ogrenciAd} {item.ogrenciSoyad}
// //             </Text>
// //         </TouchableOpacity>
// //     );

// //     // 🎨 Takvim hücresi render fonksiyonu
// //     // Bu fonksiyon hem ay hem hafta görünümünde kullanılır
// //     const renderCalendarDay = (day, index) => {
// //         // String karşılaştırması: seçili gün kontrolü
// //         const isSelected = day.date.toDateString() === selectedDate.toDateString();
// //         const dayNumber = day.date.getDate(); // Günün sayısı (1-31)

// //         return (
// //             <TouchableOpacity
// //                 key={index} // React'te liste elemanları için unique key gerekli
// //                 style={[
// //                     styles.calendarDay,
// //                     // Conditional styling array: koşullu stil ekleme
// //                     !day.isCurrentMonth && styles.nonCurrentMonthDay,
// //                     day.isToday && styles.today,
// //                     isSelected && styles.selectedDay, // En son gelen üstteki stilleri ezer
// //                 ]}
// //                 onPress={() => selectDay(day)} // Arrow function: parametre geçmek için
// //             >
// //                 <Text
// //                     style={[
// //                         styles.dayText,
// //                         !day.isCurrentMonth && styles.nonCurrentMonthText,
// //                         day.isToday && styles.todayText,
// //                         isSelected && styles.selectedDayText,
// //                     ]}
// //                 >
// //                     {dayNumber}
// //                 </Text>
// //                 {/* Conditional rendering: etkinlik varsa nokta göster */}
// //                 {day.hasEvent && <View style={styles.eventDot} />}
// //             </TouchableOpacity>
// //         );
// //     };

// //     // ⏳ Loading durumu render'ı
// //     // Component henüz yükleniyorsa bu ekranı göster
// //     if (loading) {
// //         return (
// //             <View style={styles.centerContainer}>
// //                 <ActivityIndicator size="large" color="#3498db" />
// //                 <Text style={styles.loadingText}>Yükleniyor...</Text>
// //             </View>
// //         );
// //     }

// //     // 🖼️ Ana component render'ı
// //     // JSX: JavaScript XML - React'te UI tanımlama syntaxı
// //     return (
// //         <View style={styles.container}>
// //             {/* TAKVIM BÖLÜMÜ */}
// //             <View style={styles.takvimContainer}>
// //                 {/* Üst bar: Görünüm switch'i ve ay/hafta navigasyonu */}
// //                 <View style={styles.ustBar}>
// //                     {/* Sol: Görünüm değiştirme switch'i */}
// //                     <View style={styles.switchContainer}>
// //                         <Text style={styles.switchLabel}>Ay</Text>
// //                         <Switch
// //                             value={isWeekView} // Switch'in açık/kapalı durumu
// //                             onValueChange={toggleView} // Değiştiğinde çağrılacak fonksiyon
// //                             trackColor={{ false: '#ecf0f1', true: '#3498db' }} // Track renkleri
// //                             thumbColor={isWeekView ? '#ffffff' : '#bdc3c7'} // Thumb rengi
// //                         />
// //                         <Text style={styles.switchLabel}>Hafta</Text>
// //                     </View>

// //                     {/* Sağ: Bugüne git butonu */}
// //                     <TouchableOpacity
// //                         style={styles.bugunButton}
// //                         onPress={() => {
// //                             const today = new Date();
// //                             setSelectedDate(today);
// //                             if (isWeekView) {
// //                                 setCurrentWeek(getMonday(today));
// //                             } else {
// //                                 setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
// //                             }
// //                         }}
// //                     >
// //                         <Text style={styles.bugunButtonText}>Bugün</Text>
// //                     </TouchableOpacity>
// //                 </View>

// //                 {/* Ay/hafta navigasyonu */}
// //                 <View style={styles.ayNavigasyon}>
// //                     <TouchableOpacity
// //                         onPress={() => isWeekView ? changeWeek(-1) : changeMonth(-1)}
// //                         style={styles.navButton}
// //                     >
// //                         <MaterialIcons name="chevron-left" size={28} color="#2c3e50" />
// //                     </TouchableOpacity>

// //                     <Text style={styles.ayText}>
// //                         {isWeekView ? formatWeek(currentWeek) : formatMonth(currentMonth)}
// //                     </Text>

// //                     <TouchableOpacity
// //                         onPress={() => isWeekView ? changeWeek(1) : changeMonth(1)}
// //                         style={styles.navButton}
// //                     >
// //                         <MaterialIcons name="chevron-right" size={28} color="#2c3e50" />
// //                     </TouchableOpacity>
// //                 </View>

// //                 {/* Gün başlıkları satırı */}
// //                 <View style={styles.weekDaysContainer}>
// //                     {DAY_NAMES.map((name, i) => (
// //                         <Text key={i} style={styles.weekDayText}>
// //                             {name}
// //                         </Text>
// //                     ))}
// //                 </View>

// //                 {/* Takvim ızgarası */}
// //                 {/* flexWrap: 'wrap' - 7 elemandan sonra alt satıra geç */}
// //                 <View style={styles.calendarGrid}>
// //                     {calendarDays.map((day, index) => renderCalendarDay(day, index))}
// //                 </View>

// //                 {/* Seçilen tarih bilgi kutusu */}
// //                 <View style={styles.selectedDateContainer}>
// //                     <Text style={styles.selectedDateText}>
// //                         {selectedDate.toLocaleDateString('tr-TR', {
// //                             weekday: 'long', // "Pazartesi"
// //                             day: 'numeric',  // "31"
// //                             month: 'long',   // "Ağustos"
// //                             year: 'numeric', // "2025"
// //                         })}
// //                     </Text>
// //                 </View>
// //             </View>

// //             {/* ORTA: Aksiyon butonları */}
// //             <View style={styles.butonlarContainer}>
// //                 {/* Yeni Randevu - seçili tarihi prop olarak gönder */}
// //                 <TouchableOpacity
// //                     style={[styles.ortaButon, { backgroundColor: '#3498db' }]}
// //                     onPress={() => navigation.navigate('AjandaKayitEkle', {
// //                         selectedDate: selectedDate.toISOString() // ISO string formatında tarih gönder
// //                     })}
// //                 >
// //                     <MaterialIcons name="add" size={20} color="white" />
// //                     <Text style={styles.ortaButonText}>Yeni Kayıt</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                     style={[styles.ortaButon, { backgroundColor: '#e74c3c' }]}
// //                     onPress={() => setShowOgrenciList(true)}
// //                 >
// //                     <FontAwesome5 name="user-graduate" size={18} color="white" />
// //                     <Text style={styles.ortaButonText}>Öğrenciler</Text>
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                     style={[styles.ortaButon, { backgroundColor: '#2ecc71' }]}
// //                     onPress={() => navigation.navigate('AnaSayfa')}
// //                 >
// //                     <MaterialIcons name="home" size={20} color="white" />
// //                     <Text style={styles.ortaButonText}>Ana Sayfa</Text>
// //                 </TouchableOpacity>
// //             </View>

// //             {/* ALT: Randevu listesi */}
// //             <View style={styles.randevuListContainer}>
// //                 <Text style={styles.listeBaslik}>
// //                     {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long' })} Randevuları
// //                 </Text>

// //                 {/* Conditional rendering: randevu varsa liste, yoksa boş mesaj */}
// //                 {randevular.length > 0 ? (
// //                     <FlatList
// //                         data={randevular} // Render edilecek veri dizisi
// //                         renderItem={renderRandevuItem} // Her öğe için render fonksiyonu
// //                         keyExtractor={(item) => item.id.toString()} // Unique key üretici
// //                         contentContainerStyle={styles.listeContent} // İçerik container stili
// //                         showsVerticalScrollIndicator={false} // Scroll bar gizle
// //                     />
// //                 ) : (
// //                     <View style={styles.bosListe}>
// //                         <MaterialIcons name="event-busy" size={50} color="#ddd" />
// //                         <Text style={styles.bosListeText}>Bu tarihte randevu bulunmamaktadır</Text>
// //                     </View>
// //                 )}
// //             </View>

// //             {/* MODAL: Öğrenci listesi */}
// //             {/* Modal component: üst üste açılan pencere */}
// //             <Modal
// //                 visible={showOgrenciList} // Görünürlük state'i
// //                 transparent={true} // Arka plan şeffaf
// //                 animationType="fade" // Açılma animasyonu
// //                 onRequestClose={() => setShowOgrenciList(false)} // Android geri tuşu
// //             >
// //                 {/* TouchableWithoutFeedback: görünür feedback olmadan dokunma algılama */}
// //                 <TouchableWithoutFeedback onPress={() => setShowOgrenciList(false)}>
// //                     <View style={styles.modalOverlay}>
// //                         {/* İç içe TouchableWithoutFeedback: içeriğe tıklayınca kapanmasın */}
// //                         <TouchableWithoutFeedback onPress={() => { }}>
// //                             <View style={styles.modalContent}>
// //                                 <Text style={styles.modalTitle}>
// //                                     Öğrenci Listesi ({ogrenciler.length} öğrenci)
// //                                 </Text>

// //                                 {ogrenciler.length > 0 ? (
// //                                     <FlatList
// //                                         data={ogrenciler}
// //                                         renderItem={renderOgrenciItem}
// //                                         keyExtractor={(item) => item.ogrenciId.toString()}
// //                                         contentContainerStyle={styles.modalList}
// //                                     />
// //                                 ) : (
// //                                     <Text style={styles.bosOgrenciText}>
// //                                         Kayıtlı öğrenci bulunamadı
// //                                     </Text>
// //                                 )}
// //                             </View>
// //                         </TouchableWithoutFeedback>
// //                     </View>
// //                 </TouchableWithoutFeedback>
// //             </Modal>
// //         </View>
// //     );
// // }

// // // ------------------------------- STYLES --------------------------------------
// // // StyleSheet.create(): React Native'de stil tanımlama metodu
// // // CSS'e benzer ama React Native için optimize edilmiş
// // // Stil objeleri JavaScript objesi formatında yazılır

// // const styles = StyleSheet.create({
// //     // 📱 Ana container - flex: 1 tüm ekranı kaplar
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#f8f9fa',
// //     },

// //     // ⏳ Yüklenme ekranı merkezleme
// //     centerContainer: {
// //         flex: 1,
// //         justifyContent: 'center', // Dikey merkezleme
// //         alignItems: 'center',     // Yatay merkezleme
// //         backgroundColor: '#f8f9fa',
// //     },
// //     loadingText: {
// //         marginTop: 10,
// //         color: '#7f8c8d',
// //         fontSize: 14,
// //     },

// //     // 📅 Takvim ana kutusu
// //     takvimContainer: {
// //         backgroundColor: 'white',
// //         padding: 15,
// //         borderBottomLeftRadius: 15,
// //         borderBottomRightRadius: 15,
// //         // Shadow (gölge) özellikleri - iOS ve Android için farklı
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 4,
// //         elevation: 3, // Android shadow
// //     },

// //     // 🔝 Üst bar: Switch ve bugün butonu
// //     ustBar: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 15,
// //     },

// //     // 🔀 Switch container ve label'ları
// //     switchContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     switchLabel: {
// //         fontSize: 12,
// //         color: '#7f8c8d',
// //         marginHorizontal: 8,
// //         fontWeight: '500',
// //     },

// //     // 📍 Bugüne git butonu
// //     bugunButton: {
// //         backgroundColor: '#ecf0f1',
// //         paddingHorizontal: 12,
// //         paddingVertical: 6,
// //         borderRadius: 15,
// //     },
// //     bugunButtonText: {
// //         fontSize: 12,
// //         color: '#2c3e50',
// //         fontWeight: '600',
// //     },

// //     // ⬅️➡️ Ay/hafta navigasyon çubuğu
// //     ayNavigasyon: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 15,
// //     },
// //     navButton: {
// //         padding: 5,
// //         borderRadius: 15,
// //     },
// //     ayText: {
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         color: '#2c3e50',
// //         textAlign: 'center',
// //         flex: 1, // Orta alanda maksimum yer kapla
// //     },

// //     // 📋 Hafta günleri başlık satırı
// //     weekDaysContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-around',
// //         marginBottom: 10,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#ecf0f1',
// //         paddingBottom: 5,
// //     },
// //     weekDayText: {
// //         fontSize: 12,
// //         fontWeight: '600',
// //         color: '#7f8c8d',
// //         width: CELL_WIDTH, // Hesaplanan hücre genişliği
// //         textAlign: 'center',
// //     },

// //     // 🗓️ Takvim ızgarası - flexWrap ile 7'den sonra alt satıra geç
// //     calendarGrid: {
// //         flexDirection: 'row',
// //         flexWrap: 'wrap', // Önemli: 7 elemandan sonra sarma
// //         marginBottom: 15,
// //         justifyContent: 'space-between', // Eşit dağıtım
// //     },

// //     // 📅 Tek bir takvim günü hücresi
// //     calendarDay: {
// //         width: CELL_WIDTH,
// //         height: 40,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginVertical: 2,
// //         position: 'relative', // eventDot için absolute positioning
// //         borderRadius: 20,
// //     },

// //     // 🔘 Mevcut ay dışındaki günler (soluk görünüm)
// //     nonCurrentMonthDay: {
// //         opacity: 0.35
// //     },

// //     // 🔵 Seçili gün stili (mavi arkaplan)
// //     // Not: Bu stil today stilinden sonra geldiği için önceliği var
// //     selectedDay: {
// //         backgroundColor: '#3498db',
// //     },

// //     // 🔴 Bugün stili (kırmızı çerçeve)
// //     today: {
// //         borderWidth: 2,
// //         borderColor: '#e74c3c',
// //     },

// //     // 📝 Gün numarası text stilleri
// //     dayText: {
// //         fontSize: 14,
// //         color: '#2c3e50',
// //         fontWeight: '500',
// //     },
// //     nonCurrentMonthText: {
// //         color: '#bdc3c7'
// //     },
// //     selectedDayText: {
// //         color: 'white',
// //         fontWeight: 'bold',
// //     },
// //     todayText: {
// //         color: '#e74c3c',
// //         fontWeight: 'bold',
// //     },

// //     // 🔴 Etkinlik noktası (günün altında küçük nokta)
// //     eventDot: {
// //         position: 'absolute',
// //         bottom: 2,
// //         width: 6,
// //         height: 6,
// //         borderRadius: 3,
// //         backgroundColor: '#e74c3c',
// //     },

// //     // 📋 Seçili tarih bilgi kutusu
// //     selectedDateContainer: {
// //         alignItems: 'center',
// //         padding: 10,
// //         backgroundColor: '#ecf0f1',
// //         borderRadius: 10,
// //     },
// //     selectedDateText: {
// //         fontSize: 14,
// //         fontWeight: '600',
// //         color: '#2c3e50',
// //     },

// //     // 🔘 Orta butonlar container'ı
// //     butonlarContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         padding: 15,
// //         backgroundColor: 'white',
// //         marginVertical: 10,
// //         marginHorizontal: 10,
// //         borderRadius: 15,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 4,
// //         elevation: 3,
// //     },
// //     ortaButon: {
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         width: 100,
// //         height: 40,
// //         borderRadius: 20,
// //         flexDirection: 'row', // İkon ve text yan yana
// //     },
// //     ortaButonText: {
// //         color: 'white',
// //         fontWeight: '600',
// //         fontSize: 11,
// //         marginLeft: 4,
// //     },

// //     // 📝 Randevu listesi bölümü
// //     randevuListContainer: {
// //         flex: 1,
// //         padding: 15
// //     },
// //     listeBaslik: {
// //         fontSize: 16,
// //         fontWeight: 'bold',
// //         color: '#2c3e50',
// //         marginBottom: 10,
// //         textAlign: 'center',
// //     },
// //     listeContent: {
// //         paddingBottom: 20
// //     },

// //     // 📋 Tek bir randevu kartı
// //     randevuItem: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         backgroundColor: 'white',
// //         padding: 12,
// //         borderRadius: 8,
// //         marginBottom: 8,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 1 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 2,
// //         elevation: 2,
// //     },
// //     tamamlandiItem: {
// //         opacity: 0.7,
// //         backgroundColor: '#f8f9fa'
// //     },

// //     // ⏰ Randevu saat kutusu
// //     randevuSaat: {
// //         backgroundColor: '#3498db',
// //         padding: 8,
// //         borderRadius: 6,
// //         marginRight: 12,
// //         minWidth: 60,
// //         alignItems: 'center',
// //     },
// //     randevuSaatText: {
// //         color: 'white',
// //         fontWeight: 'bold',
// //         fontSize: 12
// //     },

// //     // 👤 Randevu bilgi alanı (öğrenci adı ve ders)
// //     randevuBilgi: {
// //         flex: 1 // Kalan alanı kapla
// //     },
// //     randevuOgrenci: {
// //         fontSize: 14,
// //         fontWeight: '600',
// //         color: '#2c3e50',
// //         marginBottom: 2,
// //     },
// //     randevuDers: {
// //         fontSize: 12,
// //         color: '#7f8c8d'
// //     },
// //     randevuDurum: {
// //         marginLeft: 8
// //     },

// //     // 📭 Boş liste gösterimi
// //     bosListe: {
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         padding: 30
// //     },
// //     bosListeText: {
// //         marginTop: 10,
// //         color: '#95a5a6',
// //         textAlign: 'center',
// //         fontSize: 14
// //     },

// //     // 🪟 Modal stilleri
// //     modalOverlay: {
// //         flex: 1,
// //         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı şeffaf siyah
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     modalContent: {
// //         backgroundColor: 'white',
// //         borderRadius: 15,
// //         padding: 20,
// //         width: '80%',
// //         maxHeight: '60%',
// //     },
// //     modalTitle: {
// //         fontSize: 16,
// //         fontWeight: 'bold',
// //         color: '#2c3e50',
// //         marginBottom: 12,
// //         textAlign: 'center',
// //     },
// //     modalList: {
// //         paddingBottom: 8
// //     },

// //     // 👤 Modal içindeki öğrenci satırı
// //     ogrenciItem: {
// //         padding: 12,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#ecf0f1'
// //     },
// //     ogrenciText: {
// //         fontSize: 14,
// //         color: '#2c3e50'
// //     },
// //     bosOgrenciText: {
// //         textAlign: 'center',
// //         color: '#95a5a6',
// //         fontStyle: 'italic',
// //         padding: 20
// //     },
// // });

// // // 📤 Default export: bu component'i başka dosyalarda import edebilmek için
// // // import Ajanda from './ajanda' şeklinde kullanılabilir

// // Ajanda.js
// // ===========================
// // Bu ekran, SQLite veritabanındaki ajanda kayıtlarını (randevu/etkinlik)
// // listelemek, eklemek, güncellemek ve silmek için kullanılacak.
// // Ajanda verileri 'ajanda' tablosundan çekilir ve kullanıcının eklediği kayıtlarla güncellenir.
// //
// // Kullanılan bileşenler:
// // - React hooks (useState, useEffect) : state yönetimi ve lifecycle
// // - FlatList : kayıtları listelemek
// // - Alert : kullanıcıya onay veya uyarı göstermek
// // - ajandaDatabase.js : veritabanı işlemleri (CRUD fonksiyonları)

// import React, { useState, useEffect } from "react";
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Button, 
//   Alert, 
//   StyleSheet, 
//   TouchableOpacity 
// } from "react-native";

// // Veritabanı fonksiyonlarını import ediyoruz
// // Not: Bu dosya util/ klasöründe olacak
// import { 
//   getAjanda, 
//   addAjanda, 
//   updateAjanda, 
//   deleteAjanda 
// } from "../util/ajandaDatabase";

// export default function Ajanda() {
//   // Kayıtların state’i
//   const [ajandaList, setAjandaList] = useState([]);

//   // Sayfa ilk açıldığında ajanda kayıtlarını yükler
//   useEffect(() => {
//     loadAjanda();
//   }, []);

//   // Veritabanından kayıtları çekip state’e atayan fonksiyon
//   async function loadAjanda() {
//     try {
//       const data = await getAjanda(); // tüm kayıtları çek
//       setAjandaList(data);           // state’e at
//     } catch (error) {
//       console.error("Ajanda yüklenirken hata:", error);
//     }
//   }

//   // Yeni kayıt eklemek için fonksiyon
//   async function handleAdd() {
//     try {
//       // Şimdilik örnek veri ekliyoruz.
//       // İleride bu kısım formdan alınan kullanıcı girdileriyle değiştirilebilir.
//       await addAjanda({
//         ogrenciId: null,
//         isim: "Yeni Kayıt", 
//         tarih: "2025-09-01", 
//         saat: "10:00"
//       });

//       // Eklemeden sonra listeyi güncelle
//       loadAjanda();
//     } catch (error) {
//       console.error("Kayıt eklenirken hata:", error);
//     }
//   }

//   // Kayıt güncelleme
//   async function handleUpdate(item) {
//     try {
//       // İsim bilgisini güncelliyoruz (örnek amaçlı)
//       await updateAjanda(item.id, {
//         ogrenciId: item.ogrenciId,
//         isim: item.isim + " (güncellendi)",
//         tarih: item.tarih,
//         saat: item.saat
//       });

//       loadAjanda();
//     } catch (error) {
//       console.error("Kayıt güncellenirken hata:", error);
//     }
//   }

//   // Kayıt silme
//   function handleDelete(id) {
//     // Kullanıcıdan silme için onay alıyoruz
//     Alert.alert(
//       "Silme Onayı",
//       "Bu kaydı silmek istediğinizden emin misiniz?",
//       [
//         { text: "Vazgeç", style: "cancel" },
//         { 
//           text: "Sil", 
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteAjanda(id);
//               loadAjanda();
//             } catch (error) {
//               console.error("Kayıt silinirken hata:", error);
//             }
//           }
//         }
//       ]
//     );
//   }

//   // Her kayıt için render edilecek bileşen
//   function renderItem({ item }) {
//     return (
//       <TouchableOpacity 
//         style={styles.item} 
//         onPress={() => handleUpdate(item)} // tıklayınca güncelle
//         onLongPress={() => handleDelete(item.id)} // uzun basınca sil
//       >
//         <Text style={styles.itemText}>
//           {item.tarih} - {item.saat} → {item.isim}
//         </Text>
//       </TouchableOpacity>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📅 Ajanda</Text>

//       {/* Kayıt Ekleme Butonu */}
//       <Button title="Yeni Kayıt Ekle" onPress={handleAdd} />

//       {/* Kayıtların Listelenmesi */}
//       <FlatList
//         data={ajandaList}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// }

// // ============================
// // STYLES
// // ============================
// // React Native'de CSS yerine StyleSheet kullanıyoruz.
// // Nesne yapısı içinde key: value formatı vardır.
// // Flexbox mantığı kullanılır.
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f4f4f4",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   item: {
//     backgroundColor: "white",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3, // Android gölge efekti
//   },
//   itemText: {
//     fontSize: 16,
//   },
// });


// ajanda.js (gerçek verilerle güncellenmiş sürüm)
// -----------------------------------------------------------------------------
// Bu dosya, SQLite veritabanından gerçek ajanda verilerini çeker ve gösterir.
// Hafta/ay görünümü arasında geçiş yapabilen, Pazartesi başlangıçlı takvim ızgarası
// ve öğrenci/randevu listeleri olan Ajanda ekranını içerir.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ogrencileriListele } from '../utils/database';
import { gunlukAjandaGetir, tumAjandaKayitlariniGetir } from '../utils/ajandaDatabase';
import { initDatabase } from '../utils/database';

// 📐 Ekran genişliği hesaplaması
const { width } = Dimensions.get('window');
const CELL_WIDTH = (width - 30) / 7;

// 📅 Haftanın gün isimleri (Pazartesi başlangıçlı)
const DAY_NAMES = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

// 🔄 JavaScript Date.getDay() dönüştürücü fonksiyon
const getDayIndex = (date) => {
    const jsDay = date.getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
};

// 📆 Verilen tarihten o haftanın Pazartesi'sini bulan fonksiyon
const getMonday = (date) => {
    const dayIndex = getDayIndex(date);
    const monday = new Date(date);
    monday.setDate(date.getDate() - dayIndex);
    return monday;
};

export default function Ajanda() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // 🏪 React State (useState hook) tanımlamaları
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(getMonday(new Date()));
    const [isWeekView, setIsWeekView] = useState(false);
    const [showOgrenciList, setShowOgrenciList] = useState(false);
    const [randevular, setRandevular] = useState([]);
    const [ogrenciler, setOgrenciler] = useState([]);
    const [calendarDays, setCalendarDays] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔄 useEffect Hook'ları
    useEffect(() => {
        initDatabase();
        if (isWeekView) {
            generateWeekDays();
        } else {
            generateCalendarDaysMonth();
        }
    }, [currentMonth, currentWeek, isWeekView]);

    useEffect(() => {
        if (isFocused) {
            fetchOgrenciler();
            fetchRandevularForDate(selectedDate);
        }
    }, [isFocused]);

    useEffect(() => {
        fetchRandevularForDate(selectedDate);
    }, [selectedDate]);

    // 🔗 Asenkron fonksiyon: Veritabanından öğrenci listesi çekme
    const fetchOgrenciler = async () => {
        try {
            setLoading(true);
            const result = await ogrencileriListele(false);
            if (result?.success) {
                setOgrenciler(result.data || []);
            }
        } catch (error) {
            console.error('ajanda_Öğrenci listesi alınamadı:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🔗 Asenkron fonksiyon: Seçilen tarihin randevularını çekme
    const fetchRandevularForDate = async (date) => {
        try {
            const secilengun = new Date(date);
            secilengun.setDate(date.getDate() + 1); //indis 0 ile başladığı için düzeltme yapmak gerekti
            // Tarihi YYYY-MM-DD formatına çevir
            const formattedDate = secilengun.toISOString().split('T')[0];

            // Veritabanından randevuları çek
            const randevuData = await gunlukAjandaGetir(formattedDate);

            // Veritabanından gelen randevuları state'e set et
            setRandevular(randevuData.data || []);


        } catch (error) {
            console.error('ajanda_Randevular alınamadı:', error);
            setRandevular([]);
        }
    };

    // 📅 AY GÖRÜNÜMÜ: 42 hücrelik takvim ızgarası oluşturma
    const generateCalendarDaysMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayIndex = getDayIndex(firstDay);
        const days = [];
        const today = new Date();

        // 1️⃣ ÖNCEKİ AYDAN GÜNLER
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex; i > 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDate - i + 1);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: false,
                hasEvent: false, // Artık gerçek veri kullanacağız
            });
        }

        // 2️⃣ BU AYDAN GÜNLER
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.toDateString() === today.toDateString(),
                hasEvent: false, // Artık gerçek veri kullanacağız
            });
        }

        // 3️⃣ SONRAKİ AYDAN GÜNLER
        const totalCells = 42;
        const remainingCells = totalCells - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            days.push({
                date,
                isCurrentMonth: false,
                isToday: false,
                hasEvent: false, // Artık gerçek veri kullanacağız
            });
        }

        setCalendarDays(days);
    };

    // 📅 HAFTA GÖRÜNÜMÜ: 7 günlük sıralı liste oluşturma
    const generateWeekDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeek);
            date.setDate(currentWeek.getDate() + i);

            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.toDateString() === today.toDateString(),
                hasEvent: false, // Artık gerçek veri kullanacağız
            });
        }

        setCalendarDays(days);
    };

    // 🗓️ Ay formatlaması fonksiyonu
    const formatMonth = (date) =>
        date.toLocaleDateString('tr-TR', {
            month: 'long',
            year: 'numeric'
        });

    // 📆 Hafta formatlaması fonksiyonu
    const formatWeek = (mondayDate) => {
        const sunday = new Date(mondayDate);
        sunday.setDate(mondayDate.getDate() + 6);

        if (mondayDate.getMonth() === sunday.getMonth()) {
            return `${mondayDate.getDate()}-${sunday.getDate()} ${formatMonth(mondayDate)}`;
        } else {
            return `${mondayDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${sunday.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
    };

    // ⬅️➡️ Ay değiştirme fonksiyonu
    const changeMonth = (direction) => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + direction);
        setCurrentMonth(nextMonth);

        if (selectedDate.getMonth() !== nextMonth.getMonth() ||
            selectedDate.getFullYear() !== nextMonth.getFullYear()) {
            setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
        }
    };

    // ⬅️➡️ Hafta değiştirme fonksiyonu
    const changeWeek = (direction) => {
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(currentWeek.getDate() + (direction * 7));
        setCurrentWeek(nextWeek);

        const newSelectedDate = new Date(selectedDate);
        newSelectedDate.setDate(selectedDate.getDate() + (direction * 7));
        setSelectedDate(newSelectedDate);
    };

    // 🔀 Görünüm değiştirme fonksiyonu
    const toggleView = (value) => {
        setIsWeekView(value);

        if (value) {
            setCurrentWeek(getMonday(selectedDate));
        } else {
            setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        }
    };

    // 👆 Gün seçme fonksiyonu
    const selectDay = async (day) => {
        setSelectedDate(day.date);


        await fetchRandevularForDate(day.date);

    };

    // 🎨 FlatList renderItem fonksiyonu: Randevu listesi
    const renderRandevuItem = ({ item }) => {
        // sutun1 değerine göre durum belirleme
        const isCompleted = item.sutun1 === 'tamamlandı';

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('AjandaRandevuDuzenle', { randevu: item })}>
                <View style={[
                    styles.randevuItem,
                    isCompleted && styles.tamamlandiItem
                ]}>
                    <View style={styles.randevuSaat}>
                        <Text style={styles.randevuSaatText}>{item.saat}</Text>
                    </View>

                    <View style={styles.randevuBilgi}>
                        <Text style={styles.randevuOgrenci}>{item.ogrAdsoyad}</Text>
                        {/* Ders bilgisi kaldırıldı */}
                    </View>

                    <View style={styles.randevuDurum}>
                        {isCompleted ? (
                            <MaterialIcons name="check-circle" size={24} color="#27ae60" />
                        ) : (
                            <MaterialIcons name="schedule" size={24} color="#f39c12" />
                        )}
                    </View>
                </View></TouchableOpacity>
        );
    };

    // 🎨 FlatList renderItem fonksiyonu: Öğrenci listesi
    const renderOgrenciItem = ({ item }) => (
        <TouchableOpacity
            style={styles.ogrenciItem}
            onPress={() => setShowOgrenciList(false)}
        >
            <Text style={styles.ogrenciText}>
                {item.ogrenciAd} {item.ogrenciSoyad}
            </Text>
        </TouchableOpacity>
    );

    // 🎨 Takvim hücresi render fonksiyonu
    const renderCalendarDay = (day, index) => {
        const isSelected = day.date.toDateString() === selectedDate.toDateString();
        const dayNumber = day.date.getDate();

        return (
            <TouchableOpacity
                key={index}
                style={[
                    styles.calendarDay,
                    !day.isCurrentMonth && styles.nonCurrentMonthDay,
                    day.isToday && styles.today,
                    isSelected && styles.selectedDay,
                ]}
                onPress={() => {
                    console.log("ajanda_seçilen gün:", day.date);
                    selectDay(day)
                }
                }
            >
                <Text
                    style={[
                        styles.dayText,
                        !day.isCurrentMonth && styles.nonCurrentMonthText,
                        day.isToday && styles.todayText,
                        isSelected && styles.selectedDayText,
                    ]}
                >
                    {dayNumber}
                </Text>
                {/* Etkinlik noktası kaldırıldı - gerçek veri kullanımı için */}
            </TouchableOpacity>
        );
    };

    // ⏳ Loading durumu render'ı
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    // 🖼️ Ana component render'ı
    return (
        <View style={styles.container}>
            {/* TAKVIM BÖLÜMÜ */}
            <View style={styles.takvimContainer}>
                <View style={styles.ustBar}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Ay</Text>
                        <Switch
                            value={isWeekView}
                            onValueChange={toggleView}
                            trackColor={{ false: '#ecf0f1', true: '#3498db' }}
                            thumbColor={isWeekView ? '#ffffff' : '#bdc3c7'}
                        />
                        <Text style={styles.switchLabel}>Hafta</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.bugunButton}
                        onPress={() => {
                            const today = new Date();
                            setSelectedDate(today);
                            if (isWeekView) {
                                setCurrentWeek(getMonday(today));
                            } else {
                                setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                            }
                        }}
                    >
                        <Text style={styles.bugunButtonText}>Bugün</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ayNavigasyon}>
                    <TouchableOpacity
                        onPress={() => isWeekView ? changeWeek(-1) : changeMonth(-1)}
                        style={styles.navButton}
                    >
                        <MaterialIcons name="chevron-left" size={28} color="#2c3e50" />
                    </TouchableOpacity>

                    <Text style={styles.ayText}>
                        {isWeekView ? formatWeek(currentWeek) : formatMonth(currentMonth)}
                    </Text>

                    <TouchableOpacity
                        onPress={() => isWeekView ? changeWeek(1) : changeMonth(1)}
                        style={styles.navButton}
                    >
                        <MaterialIcons name="chevron-right" size={28} color="#2c3e50" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekDaysContainer}>
                    {DAY_NAMES.map((name, i) => (
                        <Text key={i} style={styles.weekDayText}>
                            {name}
                        </Text>
                    ))}
                </View>

                <View style={styles.calendarGrid}>
                    {calendarDays.map((day, index) => renderCalendarDay(day, index))}
                </View>

                <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateText}>
                        {selectedDate.toLocaleDateString('tr-TR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            </View>

            {/* ORTA: Aksiyon butonları */}
            <View style={styles.butonlarContainer}>
                <TouchableOpacity
                    style={[styles.ortaButon, { backgroundColor: '#3498db' }]}
                    onPress={() => navigation.navigate('AjandaKayitEkle', {
                        selectedDate: selectedDate.toISOString()
                    })}
                >
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text style={styles.ortaButonText}>Yeni Kayıt</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.ortaButon, { backgroundColor: '#e74c3c' }]}
                    onPress={() => setShowOgrenciList(true)}
                >
                    <FontAwesome5 name="user-graduate" size={18} color="white" />
                    <Text style={styles.ortaButonText}>Öğrenciler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.ortaButon, { backgroundColor: '#2ecc71' }]}
                    onPress={() => navigation.navigate('AnaSayfa')}
                >
                    <MaterialIcons name="home" size={20} color="white" />
                    <Text style={styles.ortaButonText}>Ana Sayfa</Text>
                </TouchableOpacity>
            </View>

            {/* ALT: Randevu listesi */}
            <View style={styles.randevuListContainer}>
                <Text style={styles.listeBaslik}>
                    {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long' })} Randevuları
                </Text>

                {randevular.length > 0 ? (
                    <FlatList
                        data={randevular}
                        renderItem={renderRandevuItem}
                        keyExtractor={(item) => item.ajandaId.toString()}
                        contentContainerStyle={styles.listeContent}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.bosListe}>
                        <MaterialIcons name="event-busy" size={50} color="#ddd" />
                        <Text style={styles.bosListeText}>Bu tarihte randevu bulunmamaktadır</Text>
                    </View>
                )}
            </View>

            {/* MODAL: Öğrenci listesi */}
            <Modal
                visible={showOgrenciList}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOgrenciList(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowOgrenciList(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>
                                    Öğrenci Listesi ({ogrenciler.length} öğrenci)
                                </Text>

                                {ogrenciler.length > 0 ? (
                                    <FlatList
                                        data={ogrenciler}
                                        renderItem={renderOgrenciItem}
                                        keyExtractor={(item) => item.ogrenciId.toString()}
                                        contentContainerStyle={styles.modalList}
                                    />
                                ) : (
                                    <Text style={styles.bosOgrenciText}>
                                        Kayıtlı öğrenci bulunamadı
                                    </Text>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

// ------------------------------- STYLES --------------------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        color: '#7f8c8d',
        fontSize: 14,
    },
    takvimContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ustBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        marginHorizontal: 8,
        fontWeight: '500',
    },
    bugunButton: {
        backgroundColor: '#ecf0f1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    bugunButtonText: {
        fontSize: 12,
        color: '#2c3e50',
        fontWeight: '600',
    },
    ayNavigasyon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    navButton: {
        padding: 5,
        borderRadius: 15,
    },
    ayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        flex: 1,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        paddingBottom: 5,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7f8c8d',
        width: CELL_WIDTH,
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    calendarDay: {
        width: CELL_WIDTH,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        position: 'relative',
        borderRadius: 20,
    },
    nonCurrentMonthDay: {
        opacity: 0.35
    },
    selectedDay: {
        backgroundColor: '#3498db',
    },
    today: {
        borderWidth: 2,
        borderColor: '#e74c3c',
    },
    dayText: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '500',
    },
    nonCurrentMonthText: {
        color: '#bdc3c7'
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold',
    },
    todayText: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    selectedDateContainer: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ecf0f1',
        borderRadius: 10,
    },
    selectedDateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
    },
    butonlarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    ortaButon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 40,
        borderRadius: 20,
        flexDirection: 'row',
    },
    ortaButonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 11,
        marginLeft: 4,
    },
    randevuListContainer: {
        flex: 1,
        padding: 15
    },
    listeBaslik: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 10,
        textAlign: 'center',
    },
    listeContent: {
        paddingBottom: 20
    },
    randevuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tamamlandiItem: {
        opacity: 0.7,
        backgroundColor: '#f8f9fa'
    },
    randevuSaat: {
        backgroundColor: '#3498db',
        padding: 8,
        borderRadius: 6,
        marginRight: 12,
        minWidth: 60,
        alignItems: 'center',
    },
    randevuSaatText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
    },
    randevuBilgi: {
        flex: 1
    },
    randevuOgrenci: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 2,
    },
    randevuDurum: {
        marginLeft: 8
    },
    bosListe: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
    },
    bosListeText: {
        marginTop: 10,
        color: '#95a5a6',
        textAlign: 'center',
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalList: {
        paddingBottom: 8
    },
    ogrenciItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1'
    },
    ogrenciText: {
        fontSize: 14,
        color: '#2c3e50'
    },
    bosOgrenciText: {
        textAlign: 'center',
        color: '#95a5a6',
        fontStyle: 'italic',
        padding: 20
    },
});