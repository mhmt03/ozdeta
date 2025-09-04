import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import AnaSayfa from './screens/AnaSayfa';
import OgrenciListesi from './screens/ogrenciListesi';
import OgrenciDetay from './screens/OgrenciDetay';
import YeniKayit from './screens/YeniKayit';
import { initDatabase } from './utils/database';
import Ajanda from './screens/Ajanda';
import AjandaKayitEkle from './screens/AjandaKayitEkle';
import AjandaRandevuDuzenle from './screens/AjandaRandevuDuzenle';
import DersRapor from './screens/DersRapor';
import NotEkle from './screens/NotEkle';
import OdevEkle from './screens/OdevEkle';
import KaynakYonetimi from './screens/KaynakYonetimi';

const Stack = createStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        setLoading(true);
        await initDatabase();
        console.log('Veritabanı başarıyla başlatıldı');
        setDbInitialized(true);
      } catch (error) {
        console.error('Veritabanı başlatma hatası:', error);
        Alert.alert('Hata', 'Veritabanı başlatılamadı. Uygulamayı yeniden başlatmayı deneyin.');
      } finally {
        setLoading(false);
      }
    };

    setupDatabase();
  }, []);

  // Veritabanı yüklenene kadar loading göster
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Veritabanı yükleniyor...</Text>
      </View>
    );
  }

  // Veritabanı başlatılamazsa hata mesajı
  if (!dbInitialized) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Veritabanı başlatılamadı</Text>
        <Text>Lütfen uygulamayı yeniden başlatın</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName='AnaSayfa'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name='AnaSayfa'
          options={{ title: "Ana Sayfa", headerShown: false }}
          component={AnaSayfa}
        />
        <Stack.Screen
          name='ogrenciListesi'
          options={{ title: "Öğrenci Listesi" }}
          component={OgrenciListesi}
        />
        <Stack.Screen
          name='yeniKayit'
          options={{ title: 'Yeni Öğrenci Kaydı' }}
          component={YeniKayit}
        />
        <Stack.Screen
          name='ogrenciDetay'
          options={{ title: 'Öğrenci Detayları' }}
          component={OgrenciDetay}
        />
        <Stack.Screen
          name='Ajanda'
          component={Ajanda} />
        <Stack.Screen
          name='AjandaKayitEkle'
          component={AjandaKayitEkle} />
        <Stack.Screen
          name='AjandaRandevuDuzenle'
          component={AjandaRandevuDuzenle} />
        <Stack.Screen name='DersRapor' component={DersRapor} />
        <Stack.Screen name='NotEkle' component={NotEkle} />
        <Stack.Screen name='OdevEkle' component={OdevEkle} />
        <Stack.Screen name='KaynakYonetimi' component={KaynakYonetimi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});