import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { COLORS } from '../constants/theme';

export default function BarcodeScannerScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const listId = route?.params?.listId;
  const listTitle = route?.params?.listTitle;

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);

    navigation.navigate('ProductLookup', {
      scannedCode: String(data),
      listId,
      listTitle,
    });
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Needed</Text>

        <Text style={styles.permissionText}>
          Please allow camera access to scan product barcodes.
        </Text>

        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Allow Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Scan Barcode</Text>

        <View style={styles.backBtn} />
      </View>

      <View style={styles.cameraWrapper}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
              'qr',
            ],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />

        <View style={styles.overlay}>
          <View style={styles.scanBox} />
          <Text style={styles.helperText}>Place the barcode inside the box</Text>
        </View>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 12,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  back: {
    fontSize: 32,
    color: COLORS.white,
    marginTop: -4,
  },
  title: {
    flex: 1,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 260,
    height: 160,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  helperText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 18,
  },
  scanAgainBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 24,
    marginBottom: 28,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanAgainText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  permissionTitle: {
    color: COLORS.primaryText,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: COLORS.secondaryText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    marginBottom: 18,
  },
  permissionBtnText: {
    color: COLORS.white,
    fontWeight: '900',
  },
  cancelText: {
    color: COLORS.secondary,
    fontWeight: '900',
  },
});