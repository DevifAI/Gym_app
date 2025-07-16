import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

type Subscription = {
  name: string;
  daysLeft: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onRenew: () => void;
  subscriptions: Subscription[];
};

const SubscriptionExpiryModal = ({
  visible,
  onClose,
  onRenew,
  subscriptions,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="error-outline" size={40} color="#FF9800" />
          </View>

          <Text style={styles.title}>Subscription Alert!</Text>
          <Text style={styles.subtitle}>Some subscriptions are expiring soon.</Text>

          <View style={styles.listWrapper}>
            <FlatList
              data={subscriptions}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <View style={styles.subscriptionItem}>
                  <View style={styles.subscriptionContent}>
                    <View style={styles.subscriptionText}>
                      <Text style={styles.subscriptionName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.daysLeft,
                          item.daysLeft <= 1
                            ? styles.red
                            : item.daysLeft <= 3
                            ? styles.orange
                            : styles.green,
                        ]}
                      >
                        {item.daysLeft === 1
                          ? 'Expires in 1 day'
                          : `Expires in ${item.daysLeft} days`}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#999"
                      style={styles.chevron}
                    />
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.renewButton} onPress={onRenew}>
              <Text style={styles.renewButtonText}>Renew Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SubscriptionExpiryModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: '70%',
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  listWrapper: {
    maxHeight: 250,
    width: '100%',
    marginBottom: 20,
  },
  subscriptionItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionText: {
    flex: 1,
     flexDirection: 'row',
     alignItems:'center',
     gap: 6,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  daysLeft: {
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 10,
  },
  red: {
    color: '#D32F2F',
  },
  orange: {
    color: '#F57C00',
  },
  green: {
    color: '#388E3C',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#ECECEC',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  renewButton: {
    flex: 1,
    backgroundColor: '#00796B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  renewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
