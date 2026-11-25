import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const GHIBLI_FILMS_URL = 'https://ghibliapi.vercel.app/films';
const FALLBACK_IMAGE = 'https://image.tmdb.org/t/p/w500/7WsyChLLEzcqIFv2VwMvywNosvE.jpg';

export default function App() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(GHIBLI_FILMS_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFilms(data);
      } catch (err) {
        setError(err.message || 'Failed to load Studio Ghibli films.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const renderFilmCard = ({ item }) => {
    const imageUrl = item.image || item.movie_banner || FALLBACK_IMAGE;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.posterImage}
          resizeMode="cover"
        />

        <View style={styles.cardBody}>
          <View style={styles.topRow}>
            <Text style={styles.filmTitle}>{item.title}</Text>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>★ {item.rt_score}%</Text>
            </View>
          </View>

          <Text style={styles.subMeta}>
            Directed by {item.director} • {item.release_date} • {item.running_time} min
          </Text>

          <View style={styles.synopsisBox}>
            <Text style={styles.synopsisText} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />

      {/* Header without popcorn emoji */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Ghibli Movie Vault</Text>
        <Text style={styles.headerSubtitle}>
          Timeless animated classics & story highlights
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading Cinema Data...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={films}
          keyExtractor={(item) => item.id}
          renderItem={renderFilmCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: '#171717',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#a3a3a3',
    marginTop: 3,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#f59e0b',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2d2d2d',
    overflow: 'hidden',
  },
  posterImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#262626',
  },
  cardBody: {
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  filmTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  scorePill: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scorePillText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
  },
  subMeta: {
    fontSize: 12,
    color: '#a3a3a3',
    marginTop: 6,
  },
  synopsisBox: {
    marginTop: 10,
    backgroundColor: '#242424',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  synopsisText: {
    fontSize: 12.5,
    color: '#d4d4d4',
    lineHeight: 18,
  },
});