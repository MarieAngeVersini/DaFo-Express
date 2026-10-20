import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

const COLORS = {
  BACKGROUND: '#2C1810',
  ACCENT: '#C06C3A',
  INPUT_BG: '#F7F0E8',
  TEXT: '#FFFFFF',
  PLACEHOLDER: '#8D7B75',
};

export default function LoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [countryCode, setCountryCode] = useState('+224');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const contactValue =
    loginMethod === 'phone'
      ? `${countryCode}${phoneNumber}`.replace(/\s/g, '')
      : email.trim().toLowerCase();

  const saveProfile = async (userId: string) => {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: name.trim(),
      phone: loginMethod === 'phone' ? contactValue : null,
      email: loginMethod === 'email' ? contactValue : null,
    });

    if (error) throw error;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (name.trim().length < 2) {
        Alert.alert('Hold on!', 'Please enter your valid name.');
        return;
      }
      (global as any).userName = name.trim();
      Keyboard.dismiss();
      setStep(2);
      return;
    }

    if (step === 2) {
      if (loginMethod === 'phone') {
        if (phoneNumber.length < 5) {
          Alert.alert('Invalid Number', 'Please check your phone number.');
          return;
        }
      } else {
        if (!email.includes('@') || email.trim().length < 5) {
          Alert.alert('Invalid Email', 'Please enter a valid email address.');
          return;
        }
      }
      setLoading(true);
      try {
        const { error } =
          loginMethod === 'phone'
            ? await supabase.auth.signInWithOtp({
                phone: contactValue,
                options: { data: { full_name: name.trim() } },
              })
            : await supabase.auth.signInWithOtp({
                email: contactValue,
                options: {
                  shouldCreateUser: true,
                  data: { full_name: name.trim() },
                },
              });

        if (error) throw error;

        Keyboard.dismiss();
        setStep(3);
      } catch (error: any) {
        Alert.alert('Could not send code', error.message || 'Please check your Supabase auth settings.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (code.trim().length !== 6) {
      Alert.alert('Enter Code', 'Please enter the 6-digit verification code Supabase sent you.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } =
        loginMethod === 'phone'
          ? await supabase.auth.verifyOtp({
              phone: contactValue,
              token: code.trim(),
              type: 'sms',
            })
          : await supabase.auth.verifyOtp({
              email: contactValue,
              token: code.trim(),
              type: 'email',
            });

      if (error) throw error;
      if (!data.user) throw new Error('Supabase did not return a user.');

      await saveProfile(data.user.id);
      (global as any).hasAccess = true;
      (global as any).userName = name.trim();
      Keyboard.dismiss();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Wrong Code', error.message || 'Please try the newest code Supabase sent you.');
    } finally {
      setLoading(false);
    }
  };

  const getHeaderText = () => {
    if (step === 1) return "Let's get started";
    if (step === 2) return loginMethod === 'phone' ? "What's your number?" : "What's your email?";
    return 'Verify your account';
  };

  const getSubText = () => {
    if (step === 1) return 'We need your name to personalize your experience.';
    if (step === 2) return "We'll send you a 6-digit code to verify your identity.";
    return `Enter the 6-digit code we sent to ${contactValue}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.logoSection}>
            <Image
              source={require('../assets/images/dafo-logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.headerText}>{getHeaderText()}</Text>
            <Text style={styles.subText}>{getSubText()}</Text>

            {step === 1 && (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color={COLORS.PLACEHOLDER}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your Full Name"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            )}

            {step === 2 && (
              <View>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      loginMethod === 'phone' && styles.activeToggle,
                    ]}
                    onPress={() => setLoginMethod('phone')}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        loginMethod === 'phone' && styles.activeToggleText,
                      ]}
                    >
                      Phone
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      loginMethod === 'email' && styles.activeToggle,
                    ]}
                    onPress={() => setLoginMethod('email')}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        loginMethod === 'email' && styles.activeToggleText,
                      ]}
                    >
                      Email
                    </Text>
                  </TouchableOpacity>
                </View>

                {loginMethod === 'phone' ? (
                  <View style={styles.phoneRow}>
                    <View style={[styles.inputContainer, styles.countryCodeBox]}>
                      <TextInput
                        style={[styles.input, { textAlign: 'center' }]}
                        value={countryCode}
                        onChangeText={setCountryCode}
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>

                    <View style={[styles.inputContainer, styles.phoneBox]}>
                      <TextInput
                        style={styles.input}
                        placeholder="600 00 00 00"
                        placeholderTextColor={COLORS.PLACEHOLDER}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail"
                      size={20}
                      color={COLORS.PLACEHOLDER}
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor={COLORS.PLACEHOLDER}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                )}
              </View>
            )}

            {step === 3 && (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={COLORS.PLACEHOLDER}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ex. 123456"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                  keyboardType="number-pad"
                  value={code}
                  onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
                  autoFocus
                  maxLength={6}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>
            )}

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleNext} disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Please wait...' : step === 3 ? 'Start Ordering' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>

            {step > 1 && (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setStep(step - 1);
                }}
                style={styles.backLinkWrapper}
              >
                <Text style={styles.backLink}>Go Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  logoSection: {
    flex: 0.38,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  formSection: {
    flex: 0.62,
    backgroundColor: COLORS.INPUT_BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 24,
    justifyContent: 'center',
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
    marginBottom: 8,
  },

  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 22,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEBE9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeToggle: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  toggleText: {
    fontWeight: '600',
    color: COLORS.PLACEHOLDER,
  },

  activeToggleText: {
    color: COLORS.ACCENT,
    fontWeight: 'bold',
  },

  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  countryCodeBox: {
    width: 90,
    marginRight: 10,
  },

  phoneBox: {
    flex: 1,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 58,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    letterSpacing: 0.5,
  },

  button: {
    backgroundColor: COLORS.ACCENT,
    height: 58,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

  backLinkWrapper: {
    marginTop: 18,
  },

  backLink: {
    textAlign: 'center',
    color: COLORS.PLACEHOLDER,
    fontWeight: '600',
  },
});
