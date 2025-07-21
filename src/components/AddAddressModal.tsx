import React from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (addressData: {
    address: string;
    location: string;
    country: string;
    state: string;
    city: string;
    pin: string;
  }) => void;
  values: {
    address: string;
    location: string;
    country: string;
    state: string;
    city: string;
    pin: string;
  };
  onChange: (field: string, value: string) => void;
};

const AddAddressModal: React.FC<Props> = ({ visible, onClose, onSave, values, onChange }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalCard}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Add Address</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={22} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {renderInput('Full Address', 'address', values.address, onChange, true)}
                {renderInput('Location', 'location', values.location, onChange)}
                {renderInput('Country', 'country', values.country, onChange)}
                {renderInput('State', 'state', values.state, onChange)}
                {renderInput('City', 'city', values.city, onChange)}
                {renderInput('Pin Code', 'pin', values.pin, onChange)}

                <TouchableOpacity style={styles.saveButton} onPress={() => onSave(values)}>
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const renderInput = (
  label: string,
  field: string,
  value: string,
  onChange: (field: string, value: string) => void,
  multiline = false
) => (
  <View style={styles.inputGroup} key={field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={(text) => onChange(field, text)}
      placeholder={`Enter ${label.toLowerCase()}`}
      style={[styles.input, multiline && styles.multiline]}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      placeholderTextColor="#888"
    />
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: height * 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#111',
  },
  multiline: {
    height: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#075E4D',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#075E4D',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AddAddressModal;
