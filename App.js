import React, { useState, useEffect } from 'react';
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
import Voice from '@react-native-voice/voice';
import getThemedStyles, { lightColors, darkColors } from './styles';
import { preguntarGemini } from './geminiService';
import { ciclos, responderPregunta } from './botData';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const styles = getThemedStyles(isDarkMode);

  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [grabando, setGrabando] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    Voice.onSpeechResults = (result) => {
      if (result.value && result.value.length > 0) {
        setMensaje(result.value[0]);
      }
      setGrabando(false);
    };

    Voice.onSpeechError = (e) => {
      console.error('Error de voz:', e);
      setGrabando(false);
    };

    return () => {
      subscription.remove();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const solicitarPermisoMicrofono = async () => {
    if (Platform.OS === 'android') {
      try {
        const concedido = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permiso de Micrófono',
            message: 'ConsultaTEC necesita acceso a tu micrófono para transcribir tu voz.',
            buttonPositive: 'Aceptar',
          }
        );
        return concedido === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; 
  };

  const comenzarGrabacion = async () => {
    const tienePermiso = await solicitarPermisoMicrofono();
    if (!tienePermiso) {
      alert('No se puede grabar sin permisos de micrófono.');
      return;
    }
    try {
      setGrabando(true);
      setMensaje('');
      await Voice.start('es-ES');
    } catch (e) {
      console.error('Error al iniciar grabación', e);
      setGrabando(false);
    }
  };

  const detenerGrabacion = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Error al detener grabación', e);
    }
  };

  const manejarEnvio = async () => {
    if (mensaje.trim() === '') return;

    const mensajeUsuario = mensaje;
    setMensaje('');
    setCargando(true);

    // Agregar mensaje del usuario inmediatamente al chat
    setConversacion(prev => [...prev, { tipo: 'usuario', texto: mensajeUsuario }]);

    const respuestaLocal = responderPregunta(mensajeUsuario);

    if (respuestaLocal) {
      setConversacion(prev => [...prev, { tipo: 'bot', texto: `⚡️ ${respuestaLocal}` }]);
    } else {
      const contexto = `Actúa como el bot institucional de ConsultaTEC. Estos son los ciclos y cursos disponibles:\n${JSON.stringify(ciclos, null, 2)}\n\nPregunta del estudiante: ${mensajeUsuario}`;
      const respuestaGemini = await preguntarGemini(contexto);
      setConversacion(prev => [...prev, { tipo: 'bot', texto: `☁️ ${respuestaGemini}` }]);
    }
    setCargando(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.navbar}>
            <Text style={styles.navTitle}>ConsultaTEC</Text>
            <TouchableOpacity onPress={() => setConversacion([])} style={styles.navButton}>
              <Text style={styles.navButtonText}>Nuevo chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.navButton}>
              <Text style={styles.navButtonText}>{isDarkMode ? '🌞 Claro' : '🌙 Oscuro'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chat}>
            {conversacion.map((msg, index) => (
              <View key={index} style={msg.tipo === 'usuario' ? styles.userBubble : styles.botBubble}>
                <Text style={styles.bubbleText}>
                  {msg.tipo === 'usuario' ? 'Tú: ' : 'Bot: '}
                  {msg.texto}
                </Text>
              </View>
            ))}
            {cargando && <Text style={styles.thinkingText}>💬 Pensando...</Text>}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu pregunta..."
              placeholderTextColor={isDarkMode ? darkColors.inputPlaceholder : lightColors.inputPlaceholder}
              value={mensaje}
              onChangeText={setMensaje}
            />
            <Button title="Enviar" onPress={manejarEnvio} />
            <TouchableOpacity
              onPress={grabando ? detenerGrabacion : comenzarGrabacion}
              style={styles.micButton}
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