
// import { KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';

// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     TextInput,
//     Alert,
//     FlatList,
//     Modal,
//     Switch,
//     Platform
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {
//     kaynakKaydet,
//     kaynakListesi,
//     kaynakSil,
//     odevKaydet,
//     odevGuncelle,
//     ogrenciOdevleri,
//     tekOgrenci
// } from '../utils/database';

// export default function OdevEkle() {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { ogrenciId } = route.params;

//     const [ogrenci, setOgrenci] = useState(null);
//     const [kaynaklar, setKaynaklar] = useState([]);
//     const [odevler, setOdevler] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Kaynak popup state'leri - artık kullanılmıyor, silinebilir
//     // const [kaynakPopupAcik, setKaynakPopupAcik] = useState(false);
//     // const [yeniKaynak, setYeniKaynak] = useState('');

//     // Ödev formu state'leri
//     const [kayitsizKaynak, setKayitsizKaynak] = useState(false);
//     const [seciliKaynak, setSeciliKaynak] = useState('');
//     const [serbetKaynak, setSerbetKaynak] = useState('');
//     const [odevKonusu, setOdevKonusu] = useState('');
//     const [verilmeTarihi, setVerilmeTarihi] = useState(new Date());
//     const [teslimTarihi, setTeslimTarihi] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
//     const [verilmeTarihPickerAcik, setVerilmeTarihPickerAcik] = useState(false);
//     const [teslimTarihPickerAcik, setTeslimTarihPickerAcik] = useState(false);

//     // Ödev güncelleme state'leri
//     const [guncellenenOdev, setGuncellenenOdev] = useState(null);

//     useEffect(() => {
//         veriAl();
//     }, []);

//     const veriAl = async () => {
//         try {
//             setLoading(true);

//             // Öğrenci bilgilerini al
//             const ogrenciResult = await tekOgrenci(ogrenciId);
//             if (ogrenciResult.success) {
//                 setOgrenci(ogrenciResult.data);
//             }

//             // Kaynakları al
//             await kaynaklariYenile();

//             // Ödevleri al
//             await odevleriYenile();

//         } catch (error) {
//             console.error('Veri alma hatası:', error);
//             Alert.alert('Hata', 'Veriler alınamadı');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const kaynaklariYenile = async () => {
//         try {
//             const kaynakResult = await kaynakListesi(ogrenciId);
//             if (kaynakResult.success) {
//                 setKaynaklar(kaynakResult.data);
//             }
//         } catch (error) {
//             console.error('Kaynaklar alınamadı:', error);
//         }
//     };

//     const odevleriYenile = async () => {
//         try {
//             const odevResult = await ogrenciOdevleri(ogrenciId);
//             if (odevResult.success) {
//                 // Ödevleri tarihe göre sırala (en yeni önce)
//                 const siralanmisOdevler = odevResult.data.sort((a, b) =>
//                     new Date(b.verilmetarihi) - new Date(a.verilmetarihi)
//                 );
//                 setOdevler(siralanmisOdevler);
//             }
//         } catch (error) {
//             console.error('Ödevler alınamadı:', error);
//         }
//     };

//     // Kaynak ekleme ve silme fonksiyonları - artık KaynakYonetimi sayfasında
//     // Bu fonksiyonlar silinebilir

//     // Ödev ekleme - kaynak zorunluluğu kaldırıldı
//     const odevEkle = async () => {
//         if (!odevKonusu.trim()) {
//             Alert.alert('Uyarı', 'Lütfen ödev konusunu giriniz');
//             return;
//         }

//         try {
//             const kaynakValue = kayitsizKaynak ? serbetKaynak : seciliKaynak;

//             const odevVerisi = {
//                 ogrenciId: ogrenciId,
//                 kaynak: kaynakValue || 'Belirtilmemiş', // Kaynak yoksa varsayılan değer
//                 odev: odevKonusu.trim(),
//                 verilmetarihi: verilmeTarihi.toISOString().split('T')[0],
//                 teslimttarihi: teslimTarihi.toISOString().split('T')[0],
//                 yapilmadurumu: 'Bekliyor',
//                 aciklama: `${formatTarih(verilmeTarihi)} tarihinde verildi`
//             };

//             const result = await odevKaydet(odevVerisi);

//             if (result.success) {
//                 Alert.alert('Başarılı', 'Ödev başarıyla verildi');
//                 formuTemizle();
//                 await odevleriYenile();
//             } else {
//                 Alert.alert('Hata', 'Ödev kaydedilemedi');
//             }
//         } catch (error) {
//             console.error('Ödev ekleme hatası:', error);
//             Alert.alert('Hata', 'Ödev kaydedilemedi');
//         }
//     };

//     // Form temizleme
//     const formuTemizle = () => {
//         setSeciliKaynak('');
//         setSerbetKaynak('');
//         setOdevKonusu('');
//         setVerilmeTarihi(new Date());
//         setTeslimTarihi(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
//     };

//     // Verilme tarihi değiştiğinde teslim tarihini otomatik ayarla
//     const verilmeTarihiDegistir = (tarih) => {
//         setVerilmeTarihi(tarih);
//         // 1 hafta sonrasını hesapla
//         const yeniTeslimTarihi = new Date(tarih.getTime() + 7 * 24 * 60 * 60 * 1000);
//         setTeslimTarihi(yeniTeslimTarihi);
//     };

//     // Ödev durumu güncelleme
//     const odevDurumuGuncelle = async (odev, yeniDurum) => {
//         try {
//             const guncelOdev = {
//                 ...odev,
//                 yapilmadurumu: yeniDurum,
//                 kontroltarihi: yeniDurum !== 'Bekliyor' ? new Date().toISOString().split('T')[0] : null
//             };

//             const result = await odevGuncelle(odev.odevId, guncelOdev);

//             if (result.success) {
//                 Alert.alert('Başarılı', 'Ödev durumu güncellendi');
//                 await odevleriYenile();
//             } else {
//                 Alert.alert('Hata', 'Ödev durumu güncellenemedi');
//             }
//         } catch (error) {
//             console.error('Ödev güncelleme hatası:', error);
//             Alert.alert('Hata', 'Güncelleme yapılamadı');
//         }
//     };

//     // Tarih formatı
//     const formatTarih = (tarih) => {
//         if (typeof tarih === 'string') {
//             return new Date(tarih).toLocaleDateString('tr-TR');
//         }
//         return tarih.toLocaleDateString('tr-TR');
//     };

//     // Durum rengini belirle
//     const getDurumRenk = (durum) => {
//         switch (durum) {
//             case 'Yapıldı': return '#27ae60';
//             case 'Yapılmadı': return '#e74c3c';
//             case 'Eksik': return '#f39c12';
//             default: return '#6c757d';
//         }
//     };

//     // Kaynak render fonksiyonu - artık kullanılmıyor
//     // const renderKaynak = ({ item }) => (...)

//     // Ödev render fonksiyonu
//     const renderOdev = ({ item }) => (
//         <View style={styles.odevItem}>
//             <View style={styles.odevHeader}>
//                 <Text style={styles.odevKaynak}>{item.kaynak}</Text>
//                 <View style={[styles.durumBadge, { backgroundColor: getDurumRenk(item.yapilmadurumu) }]}>
//                     <Text style={styles.durumText}>{item.yapilmadurumu || 'Bekliyor'}</Text>
//                 </View>
//             </View>

//             <Text style={styles.odevKonu}>{item.odev}</Text>

//             <View style={styles.odevTarihler}>
//                 <Text style={styles.tarihText}>
//                     Verildi: {formatTarih(item.verilmetarihi)}
//                 </Text>
//                 <Text style={styles.tarihText}>
//                     Teslim: {formatTarih(item.teslimttarihi)}
//                 </Text>
//             </View>

//             <View style={styles.durumContainer}>
//                 <Text style={styles.durumLabel}>Durum:</Text>
//                 <View style={styles.pickerContainer}>
//                     <Picker
//                         selectedValue={item.yapilmadurumu || 'Bekliyor'}
//                         onValueChange={(yeniDurum) => {
//                             if (yeniDurum !== item.yapilmadurumu) {
//                                 odevDurumuGuncelle(item, yeniDurum);
//                             }
//                         }}
//                         style={styles.durumPicker}
//                     >
//                         <Picker.Item label="Bekliyor" value="Bekliyor" />
//                         <Picker.Item label="Yapıldı" value="Yapıldı" />
//                         <Picker.Item label="Yapılmadı" value="Yapılmadı" />
//                         <Picker.Item label="Eksik" value="Eksik" />
//                     </Picker>
//                 </View>
//             </View>
//         </View>
//     );

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <Text>Yükleniyor...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <MaterialIcons name="arrow-back" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>
//                     {ogrenci ? `${ogrenci.ogrenciAd} ${ogrenci.ogrenciSoyad} - Ödev Ver` : 'Ödev Ver'}
//                 </Text>
//             </View>

//             <KeyboardAvoidingView
//                 style={styles.keyboardView}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                     <ScrollView
//                         style={styles.content}
//                         keyboardShouldPersistTaps="handled"
//                         showsVerticalScrollIndicator={false}
//                     >
//                         {/* Ödev Verme Formu */}
//                         <View style={styles.formContainer}>
//                             {/* Kaynak Ekle Butonu */}
//                             <TouchableOpacity
//                                 style={styles.kaynakEkleButon}
//                                 onPress={() => { navigation.navigate('KaynakYonetimi', ogrenci) }}
//                             >
//                                 <MaterialIcons name="add" size={20} color="white" />
//                                 <Text style={styles.kaynakEkleText}>Kaynak Yönet</Text>
//                             </TouchableOpacity>

//                             {/* Kaynak Seçimi veya Serbest Giriş */}
//                             {!kayitsizKaynak ? (
//                                 <View style={styles.inputContainer}>
//                                     <Text style={styles.inputLabel}>Kaynak Seç (İsteğe Bağlı)</Text>
//                                     <View style={styles.pickerContainer}>
//                                         <Picker
//                                             selectedValue={seciliKaynak}
//                                             onValueChange={setSeciliKaynak}
//                                             style={styles.picker}
//                                         >
//                                             <Picker.Item label="Kaynak seçiniz..." value="" />
//                                             {kaynaklar.map((kaynak) => (
//                                                 <Picker.Item
//                                                     key={kaynak.kaynakId}
//                                                     label={kaynak.kaynak}
//                                                     value={kaynak.kaynak}
//                                                 />
//                                             ))}
//                                         </Picker>
//                                     </View>
//                                 </View>
//                             ) : (
//                                 <View style={styles.inputContainer}>
//                                     <Text style={styles.inputLabel}>Kaynak Adı (İsteğe Bağlı)</Text>
//                                     <TextInput
//                                         style={styles.textInput}
//                                         value={serbetKaynak}
//                                         onChangeText={setSerbetKaynak}
//                                         placeholder="Kaynak adını yazınız"
//                                     />
//                                 </View>
//                             )}

//                             {/* Kayıtsız Kaynak Switch */}
//                             <View style={styles.switchContainer}>
//                                 <Text style={styles.switchLabel}>Serbest Kaynak Girişi</Text>
//                                 <Switch
//                                     value={kayitsizKaynak}
//                                     onValueChange={setKayitsizKaynak}
//                                     thumbColor={kayitsizKaynak ? "#4CAF50" : "#f4f3f4"}
//                                     trackColor={{ false: "#767577", true: "#81b0ff" }}
//                                 />
//                             </View>

//                             {/* Ödev Konusu */}
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.inputLabel}>Ödev Konusu *</Text>
//                                 <TextInput
//                                     style={[styles.textInput, styles.textArea]}
//                                     value={odevKonusu}
//                                     onChangeText={setOdevKonusu}
//                                     placeholder="Ödev konusunu yazınız"
//                                     multiline={true}
//                                     numberOfLines={3}
//                                 />
//                             </View>

//                             {/* Verilme Tarihi */}
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.inputLabel}>Verilme Tarihi</Text>
//                                 <TouchableOpacity
//                                     style={styles.dateButton}
//                                     onPress={() => setVerilmeTarihPickerAcik(true)}
//                                 >
//                                     <MaterialIcons name="date-range" size={20} color="#666" />
//                                     <Text style={styles.dateText}>{formatTarih(verilmeTarihi)}</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Teslim Tarihi */}
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.inputLabel}>Teslim Tarihi</Text>
//                                 <TouchableOpacity
//                                     style={styles.dateButton}
//                                     onPress={() => setTeslimTarihPickerAcik(true)}
//                                 >
//                                     <MaterialIcons name="date-range" size={20} color="#666" />
//                                     <Text style={styles.dateText}>{formatTarih(teslimTarihi)}</Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Ödev Ver Butonu */}
//                             <TouchableOpacity
//                                 style={styles.odevVerButon}
//                                 onPress={odevEkle}
//                             >
//                                 <MaterialIcons name="assignment" size={20} color="white" />
//                                 <Text style={styles.odevVerText}>Ödev Ver</Text>
//                             </TouchableOpacity>
//                         </View>

//                         {/* Ödevler Listesi */}
//                         <View style={styles.odevlerContainer}>
//                             <Text style={styles.sectionTitle}>
//                                 Verilen Ödevler ({odevler.length})
//                             </Text>

//                             {odevler.length > 0 ? (
//                                 <FlatList
//                                     data={odevler}
//                                     renderItem={renderOdev}
//                                     keyExtractor={item => item.odevId.toString()}
//                                     scrollEnabled={false}
//                                 />
//                             ) : (
//                                 <View style={styles.bosListe}>
//                                     <MaterialIcons name="assignment" size={40} color="#ddd" />
//                                     <Text style={styles.bosListeText}>Henüz ödev verilmemiş</Text>
//                                 </View>
//                             )}
//                         </View>
//                     </ScrollView>
//                 </TouchableWithoutFeedback>
//             </KeyboardAvoidingView>

//             {/* Date Pickers */}
//             {verilmeTarihPickerAcik && (
//                 <DateTimePicker
//                     value={verilmeTarihi}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={(event, selectedDate) => {
//                         setVerilmeTarihPickerAcik(Platform.OS === 'ios');
//                         if (selectedDate) {
//                             verilmeTarihiDegistir(selectedDate);
//                         }
//                     }}
//                 />
//             )}

//             {teslimTarihPickerAcik && (
//                 <DateTimePicker
//                     value={teslimTarihi}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={(event, selectedDate) => {
//                         setTeslimTarihPickerAcik(Platform.OS === 'ios');
//                         if (selectedDate) {
//                             setTeslimTarihi(selectedDate);
//                         }
//                     }}
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 16,
//         backgroundColor: 'white',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e1e8ed',
//         elevation: 2,
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginLeft: 16,
//         color: '#333',
//         flex: 1,
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     content: {
//         flex: 1,
//         padding: 16,
//     },
//     formContainer: {
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 2,
//     },
//     kaynakEkleButon: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#3498db',
//         padding: 12,
//         borderRadius: 6,
//         marginBottom: 16,
//     },
//     kaynakEkleText: {
//         color: 'white',
//         fontWeight: 'bold',
//         marginLeft: 6,
//     },
//     inputContainer: {
//         marginBottom: 16,
//     },
//     inputLabel: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 6,
//     },
//     textInput: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 6,
//         padding: 12,
//         fontSize: 16,
//         backgroundColor: '#fff',
//     },
//     textArea: {
//         minHeight: 80,
//         textAlignVertical: 'top',
//     },
//     pickerContainer: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 6,
//         backgroundColor: '#fff',
//     },
//     picker: {
//         height: 50,
//     },
//     switchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 16,
//     },
//     switchLabel: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     dateButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 6,
//         padding: 12,
//         backgroundColor: '#fff',
//     },
//     dateText: {
//         marginLeft: 8,
//         fontSize: 16,
//         color: '#333',
//     },
//     odevVerButon: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#27ae60',
//         padding: 14,
//         borderRadius: 6,
//         marginTop: 8,
//     },
//     odevVerText: {
//         color: 'white',
//         fontWeight: 'bold',
//         marginLeft: 6,
//         fontSize: 16,
//     },
//     odevlerContainer: {
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 16,
//         elevation: 2,
//         marginBottom: 20,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 12,
//     },
//     odevItem: {
//         padding: 12,
//         marginBottom: 12,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 6,
//         borderWidth: 1,
//         borderColor: '#e1e8ed',
//     },
//     odevHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     odevKaynak: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#666',
//         flex: 1,
//     },
//     durumBadge: {
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     durumText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
//     odevKonu: {
//         fontSize: 16,
//         color: '#333',
//         marginBottom: 8,
//         lineHeight: 22,
//     },
//     odevTarihler: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 12,
//     },
//     tarihText: {
//         fontSize: 12,
//         color: '#666',
//     },
//     durumContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     durumLabel: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#333',
//         marginRight: 12,
//     },
//     durumPicker: {
//         flex: 1,
//         height: 40,
//     },
//     bosListe: {
//         padding: 40,
//         alignItems: 'center',
//     },
//     bosListeText: {
//         color: '#666',
//         fontStyle: 'italic',
//         marginTop: 8,
//     },
//     // Modal stilleri
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     modalBackdrop: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
//     modalKeyboardView: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 20,
//         width: '90%',
//         maxWidth: 400,
//         maxHeight: '80%',
//         elevation: 5,
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//         paddingBottom: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e1e8ed',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     modalBody: {
//         flex: 1,
//     },
//     yeniKaynakContainer: {
//         marginBottom: 20,
//     },
//     kaynakEkleRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     kaynakInput: {
//         flex: 1,
//         marginRight: 8,
//     },
//     kaynakEkleIconButon: {
//         backgroundColor: '#27ae60',
//         padding: 10,
//         borderRadius: 6,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     mevcutKaynaklar: {
//         flex: 1,
//     },
//     kaynakListesi: {
//         maxHeight: 200,
//     },
//     kaynakItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 12,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 6,
//         borderWidth: 1,
//         borderColor: '#e1e8ed',
//         marginBottom: 8,
//     },
//     kaynakAdi: {
//         fontSize: 14,
//         color: '#333',
//         flex: 1,
//     },
//     kaynakSilButon: {
//         padding: 4,
//     },
//     bosKaynaklar: {
//         padding: 20,
//         alignItems: 'center',
//     },
//     modalFooter: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         marginTop: 16,
//         paddingTop: 16,
//         borderTopWidth: 1,
//         borderTopColor: '#e1e8ed',
//     },
//     kapatButon: {
//         backgroundColor: '#6c757d',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 6,
//     },
// });

// /*1. Klavye Sorunları Çözüldü:

// KeyboardAvoidingView'i doğru yere taşıdı ve keyboardVerticalOffset ekledi
// keyboardShouldPersistTaps="handled" ekledi ki ScrollView içindeki butonlara klavye açıkken tıklanabilsin
// Modal içinde de KeyboardAvoidingView ve TouchableWithoutFeedback ekledi*/


import { KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    Platform
} from 'react-native';
import OdevItem from '../utils/OdevItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    kaynakListesi,
    odevKaydet,
    odevGuncelle,
    ogrenciOdevleri,
    tekOgrenci
} from '../utils/database';


export default function OdevEkle() {
    const navigation = useNavigation();
    const route = useRoute();
    const { ogrenciId } = route.params;

    const [ogrenci, setOgrenci] = useState(null);
    const [kaynaklar, setKaynaklar] = useState([]);
    const [odevler, setOdevler] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ödev formu state'leri
    const [kayitsizKaynak, setKayitsizKaynak] = useState(false);
    const [seciliKaynak, setSeciliKaynak] = useState('');
    const [serbetKaynak, setSerbetKaynak] = useState('');
    const [odevKonusu, setOdevKonusu] = useState('');
    const [verilmeTarihi, setVerilmeTarihi] = useState(new Date());
    const [teslimTarihi, setTeslimTarihi] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const [verilmeTarihPickerAcik, setVerilmeTarihPickerAcik] = useState(false);
    const [teslimTarihPickerAcik, setTeslimTarihPickerAcik] = useState(false);

    useEffect(() => {
        veriAl();
    }, []);

    const veriAl = async () => {
        try {
            setLoading(true);

            // Öğrenci bilgilerini al
            const ogrenciResult = await tekOgrenci(ogrenciId);
            if (ogrenciResult.success) {
                setOgrenci(ogrenciResult.data);
            }

            // Kaynakları al
            await kaynaklariYenile();

            // Ödevleri al
            await odevleriYenile();

        } catch (error) {
            console.error('Veri alma hatası:', error);
            Alert.alert('Hata', 'Veriler alınamadı');
        } finally {
            setLoading(false);
        }
    };

    const kaynaklariYenile = async () => {
        try {
            const kaynakResult = await kaynakListesi(ogrenciId);
            if (kaynakResult.success) {
                setKaynaklar(kaynakResult.data);
            }
        } catch (error) {
            console.error('Kaynaklar alınamadı:', error);
        }
    };

    const odevleriYenile = async () => {
        try {
            const odevResult = await ogrenciOdevleri(ogrenciId);
            if (odevResult.success) {
                // Ödevleri tarihe göre sırala (en yeni önce)
                const siralanmisOdevler = odevResult.data.sort((a, b) =>
                    new Date(b.verilmetarihi) - new Date(a.verilmetarihi)
                );
                setOdevler(siralanmisOdevler);
            }
        } catch (error) {
            console.error('Ödevler alınamadı:', error);
        }
    };

    // Ödev ekleme
    const odevEkle = async () => {
        if (!odevKonusu.trim()) {
            Alert.alert('Uyarı', 'Lütfen ödev konusunu giriniz');
            return;
        }

        try {
            const kaynakValue = kayitsizKaynak ? serbetKaynak : seciliKaynak;

            const odevVerisi = {
                ogrenciId: ogrenciId,
                kaynak: kaynakValue || 'Belirtilmemiş',
                odev: odevKonusu.trim(),
                verilmetarihi: verilmeTarihi.toISOString().split('T')[0],
                teslimttarihi: teslimTarihi.toISOString().split('T')[0],
                yapilmadurumu: 'Bekliyor',
                aciklama: `${formatTarih(verilmeTarihi)} tarihinde verildi`
            };

            const result = await odevKaydet(odevVerisi);

            if (result.success) {
                Alert.alert('Başarılı', 'Ödev başarıyla verildi');
                formuTemizle();
                await odevleriYenile();
            } else {
                Alert.alert('Hata', 'Ödev kaydedilemedi');
            }
        } catch (error) {
            console.error('Ödev ekleme hatası:', error);
            Alert.alert('Hata', 'Ödev kaydedilemedi');
        }
    };

    // Form temizleme
    const formuTemizle = () => {
        setSeciliKaynak('');
        setSerbetKaynak('');
        setOdevKonusu('');
        setVerilmeTarihi(new Date());
        setTeslimTarihi(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    };

    // Ödev güncelleme fonksiyonu
    const odevGuncelleKaydet = async (odev) => {
        try {
            const result = await odevGuncelle(odev.odevId, odev);
            if (result.success) {
                Alert.alert('Başarılı', 'Ödev güncellendi');
                await odevleriYenile();
            } else {
                Alert.alert('Hata', 'Ödev güncellenemedi');
            }
        } catch (error) {
            console.error('Ödev güncelleme hatası:', error);
            Alert.alert('Hata', 'Güncelleme yapılamadı');
        }
    };

    // Tarih formatı
    const formatTarih = (tarih) => {
        if (typeof tarih === 'string') {
            return new Date(tarih).toLocaleDateString('tr-TR');
        }
        return tarih.toLocaleDateString('tr-TR');
    };

    // Verilme tarihi değiştiğinde teslim tarihini otomatik ayarla
    const verilmeTarihiDegistir = (tarih) => {
        setVerilmeTarihi(tarih);
        // 1 hafta sonrasını hesapla
        const yeniTeslimTarihi = new Date(tarih.getTime() + 7 * 24 * 60 * 60 * 1000);
        setTeslimTarihi(yeniTeslimTarihi);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {ogrenci ? `${ogrenci.ogrenciAd} ${ogrenci.ogrenciSoyad} - Ödev Ver` : 'Ödev Ver'}
                </Text>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.content}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Ödev Verme Formu */}
                        <View style={styles.formContainer}>
                            {/* Kaynak Yönetimi Butonu */}
                            <TouchableOpacity
                                style={styles.kaynakEkleButon}
                                onPress={() => navigation.navigate('KaynakYonetimi', { ogrenci })}
                            >
                                <MaterialIcons name="add" size={20} color="white" />
                                <Text style={styles.kaynakEkleText}>Kaynak Yönet</Text>
                            </TouchableOpacity>

                            {/* Kaynak Seçimi veya Serbest Giriş */}
                            {!kayitsizKaynak ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Kaynak Seç (İsteğe Bağlı)</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={seciliKaynak}
                                            onValueChange={setSeciliKaynak}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="Kaynak seçiniz..." value="" />
                                            {kaynaklar.map((kaynak) => (
                                                <Picker.Item
                                                    key={kaynak.kaynakId}
                                                    label={kaynak.kaynak}
                                                    value={kaynak.kaynak}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Kaynak Adı (İsteğe Bağlı)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={serbetKaynak}
                                        onChangeText={setSerbetKaynak}
                                        placeholder="Kaynak adını yazınız"
                                    />
                                </View>
                            )}

                            {/* Kayıtsız Kaynak Switch */}
                            <View style={styles.switchContainer}>
                                <Text style={styles.switchLabel}>Serbest Kaynak Girişi</Text>
                                <Switch
                                    value={kayitsizKaynak}
                                    onValueChange={setKayitsizKaynak}
                                    thumbColor={kayitsizKaynak ? "#4CAF50" : "#f4f3f4"}
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                />
                            </View>

                            {/* Ödev Konusu */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Ödev Konusu *</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    value={odevKonusu}
                                    onChangeText={setOdevKonusu}
                                    placeholder="Ödev konusunu yazınız"
                                    multiline={true}
                                    numberOfLines={3}
                                />
                            </View>

                            {/* Verilme Tarihi */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Verilme Tarihi</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setVerilmeTarihPickerAcik(true)}
                                >
                                    <MaterialIcons name="date-range" size={20} color="#666" />
                                    <Text style={styles.dateText}>{formatTarih(verilmeTarihi)}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Teslim Tarihi */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Teslim Tarihi</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setTeslimTarihPickerAcik(true)}
                                >
                                    <MaterialIcons name="date-range" size={20} color="#666" />
                                    <Text style={styles.dateText}>{formatTarih(teslimTarihi)}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Ödev Ver Butonu */}
                            <TouchableOpacity
                                style={styles.odevVerButon}
                                onPress={odevEkle}
                            >
                                <MaterialIcons name="assignment" size={20} color="white" />
                                <Text style={styles.odevVerText}>Ödev Ver</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Ödevler Listesi */}
                        <View style={styles.odevlerContainer}>
                            <Text style={styles.sectionTitle}>
                                Verilen Ödevler ({odevler.length})
                            </Text>

                            {odevler.length > 0 ? (
                                <FlatList
                                    data={odevler}
                                    renderItem={({ item }) => (
                                        <OdevItem
                                            item={item}
                                            onGuncelle={odevGuncelleKaydet}
                                        />
                                    )}
                                    keyExtractor={item => item.odevId.toString()}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <View style={styles.bosListe}>
                                    <MaterialIcons name="assignment" size={40} color="#ddd" />
                                    <Text style={styles.bosListeText}>Henüz ödev verilmemiş</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Date Pickers */}
            {verilmeTarihPickerAcik && (
                <DateTimePicker
                    value={verilmeTarihi}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setVerilmeTarihPickerAcik(Platform.OS === 'ios');
                        if (selectedDate) {
                            verilmeTarihiDegistir(selectedDate);
                        }
                    }}
                />
            )}

            {teslimTarihPickerAcik && (
                <DateTimePicker
                    value={teslimTarihi}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setTeslimTarihPickerAcik(Platform.OS === 'ios');
                        if (selectedDate) {
                            setTeslimTarihi(selectedDate);
                        }
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#333',
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    kaynakEkleButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },
    kaynakEkleText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    switchLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    odevVerButon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#27ae60',
        padding: 14,
        borderRadius: 6,
        marginTop: 8,
    },
    odevVerText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 16,
    },
    odevlerContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    bosListe: {
        padding: 40,
        alignItems: 'center',
    },
    bosListeText: {
        color: '#666',
        fontStyle: 'italic',
        marginTop: 8,
    },
});