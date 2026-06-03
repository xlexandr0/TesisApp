import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Appearance,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';

import Markdown from 'react-native-markdown-display';
import { LinearGradient } from 'expo-linear-gradient';
import Voice from '@react-native-voice/voice';

import getThemedStyles, {
  lightColors,
  darkColors,
} from './styles';

import { preguntarGemini } from './geminiService';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(
    systemColorScheme === 'dark'
  );

  const styles = getThemedStyles(isDarkMode);
  const scrollRef = useRef(null);

  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [grabando, setGrabando] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }) => {
        setIsDarkMode(colorScheme === 'dark');
      }
    );

    Voice.onSpeechResults = (result) => {
      if (result.value?.length > 0) {
        setMensaje(result.value[0]);
      }
      setGrabando(false);
    };

    Voice.onSpeechError = (e) => {
      console.log(e);
      setGrabando(false);
    };

    return () => {
      subscription.remove();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const solicitarPermisoMicrofono = async () => {
    if (Platform.OS === 'android') {
      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

      return (
        granted ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const comenzarGrabacion = async () => {
    const permitido =
      await solicitarPermisoMicrofono();

    if (!permitido) return;

    try {
      setGrabando(true);
      await Voice.start('es-ES');
    } catch (error) {
      console.log(error);
      setGrabando(false);
    }
  };

  const detenerGrabacion = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log(error);
    }
  };

  // 🌟 FUNCIÓN CORREGIDA Y LIMPIA PARA TU TESIS
  const manejarEnvio = async () => {
    if (!mensaje.trim()) return;

    const mensajeUsuario = mensaje;
    setMensaje('');

    // Agregar mensaje del alumno al chat
    setConversacion((prev) => [
      ...prev,
      {
        tipo: 'usuario',
        texto: mensajeUsuario,
        hora: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    setCargando(true);

    try {
      // Conecta directo con Gemini pasándole la pregunta pura
      const respuesta = await preguntarGemini(mensajeUsuario);

      // Agregar la respuesta concisa de la IA al chat
      setConversacion((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto: respuesta,
          hora: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } catch (error) {
      console.error("Error al obtener respuesta de Gemini:", error);
    }

    setCargando(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          styles.container.backgroundColor,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.container}>
          <LinearGradient
            colors={
              isDarkMode
                ? ['#4B0082', '#6A0DAD']
                : ['#007BFF', '#00BFFF']
            }
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>
                  🎓 ConsultaTEC
                </Text>
                <Text style={styles.headerSubtitle}>
                  Asistente Académico
                </Text>
              </View>

              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setConversacion([])}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsDarkMode(!isDarkMode)}
                >
                  <Text>{isDarkMode ? '🌞' : '🌙'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView
            ref={scrollRef}
            style={styles.chat}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({
                animated: true,
              })
            }
          >
            {conversacion.length === 0 && (
              <View style={styles.welcomeContainer}>
                <Text style={styles.robotEmoji}>🤖</Text>
                <Text style={styles.welcomeTitle}>Bienvenido</Text>
                <Text style={styles.welcomeText}>
                  Pregunta sobre cursos, tecnologías y ciclos.
                </Text>

                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => setMensaje('¿Qué enseñan en el 3er ciclo?')}
                >
                  <Text style={styles.quickButtonText}>📚 3er ciclo</Text>
                </TouchableOpacity>
              </View>
            )}

            {conversacion.map((msg, index) => (
              <View
                key={index}
                style={
                  msg.tipo === 'usuario'
                    ? styles.userBubble
                    : styles.botBubble
                }
              >
                <Markdown
                  style={{
                    body: {
                      color: isDarkMode ? '#fff' : '#000',
                      fontSize: 15,
                    },
                  }}
                >
                  {msg.texto}
                </Markdown>

                <Text style={styles.messageTime}>{msg.hora}</Text>
              </View>
            ))}

            {cargando && (
              <Text style={styles.thinkingText}>💬 Pensando...</Text>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Pregunta algo..."
              placeholderTextColor={
                isDarkMode
                  ? darkColors.inputPlaceholder
                  : lightColors.inputPlaceholder
              }
              value={mensaje}
              onChangeText={setMensaje}
            />

            <Button title="Enviar" onPress={manejarEnvio} />

            <TouchableOpacity
              style={styles.micButton}
              onPress={grabando ? detenerGrabacion : comenzarGrabacion}
            >
              <Text style={styles.micButtonText}>
                {grabando ? '⏹️' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}