import * as functions from 'firebase-functions';
import { getFirestore, serverTimestamp } from 'firebase-admin/firestore';
import fetch from 'node-fetch';

const db = getFirestore();

/**
 * Atualiza dados de previsão (forecast) de todas as cidades a cada 2 horas.
 * Integração padrão com API Open-Meteo.
 */
export const updateForecastData = functions.pubsub
  .schedule('every 2 hours')
  .onRun(async () => {
    const citiesSnap = await db.collection('cities').get();

    for (const cityDoc of citiesSnap.docs) {
      const city = cityDoc.data();

      if (!city.lat || !city.lng) continue;

      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&hourly=temperature_2m`
      );
      const forecastData = await forecastRes.json();

      await db
        .collection('cities')
        .doc(cityDoc.id)
        .collection('forecasts')
        .doc('latest')
        .set(
          {
            ...forecastData,
            updatedAt: serverTimestamp(),
            source: 'open-meteo',
          },
          { merge: true }
        );
    }

    console.log('✅ Forecast data updated successfully');
    return null;
  });
