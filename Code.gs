/**
 * SIGAP HUMAS - LAPAS KELAS III RANGKASBITUNG
 * Backend Core Script (code.gs) - Database Cloud Persisten Lintas Perangkat
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('SIGAP HUMAS - Lapas Kelas III Rangkasbitung')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Fungsi mengambil data arsip dan notes dari server cloud agar tidak hilang saat logout
function ambilDataServerCloud() {
  var serverProperties = PropertiesService.getScriptProperties();
  var masterArsip = serverProperties.getProperty('DATABASE_SIGAP_ARSIP');
  var masterNotes = serverProperties.getProperty('DATABASE_SIGAP_NOTES');
  
  return {
    arsip: masterArsip ? JSON.parse(masterArsip) : [],
    notes: masterNotes ? JSON.parse(masterNotes) : []
  };
}

// Fungsi menyimpan arsip baru secara permanen ke cloud server
function simpanArsipKeCloud(objekBaru) {
  var serverProperties = PropertiesService.getScriptProperties();
  var dataLamaString = serverProperties.getProperty('DATABASE_SIGAP_ARSIP');
  var dataLama = dataLamaString ? JSON.parse(dataLamaString) : [];
  
  // Format ID Unik & Tautan Otomatis Google Drive sesuai spesifikasi
  objekBaru.id = "SIGAP-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
  objekBaru.linkDrive = "https://drive.google.com/drive/folders/1xR_v7D_r9A-Qo0l88tmrSM6kTQ5h6MUg?usp=sharing";
  
  // Masukkan data baru di urutan paling atas (terbaru)
  dataLama.unshift(objekBaru);
  
  // Kunci penyimpanan di server Google
  serverProperties.setProperty('DATABASE_SIGAP_ARSIP', JSON.stringify(dataLama));
  return { success: true, data: dataLama };
}

// Fungsi menghapus arsip dari cloud server (Khusus Hak Akses Admin)
function hapusArsipDiCloud(idArsip) {
  var serverProperties = PropertiesService.getScriptProperties();
  var dataLamaString = serverProperties.getProperty('DATABASE_SIGAP_ARSIP');
  var dataLama = dataLamaString ? JSON.parse(dataLamaString) : [];
  
  var dataHasilFilter = dataLama.filter(function(item) {
    return item.id !== idArsip;
  });
  
  serverProperties.setProperty('DATABASE_SIGAP_ARSIP', JSON.stringify(dataHasilFilter));
  return { success: true, data: dataHasilFilter };
}

// Fungsi menyimpan seluruh catatan/notes kalender kegiatan secara permanen ke cloud
function simpanNotesKeCloud(arrayNotesBaru) {
  var serverProperties = PropertiesService.getScriptProperties();
  serverProperties.setProperty('DATABASE_SIGAP_NOTES', JSON.stringify(arrayNotesBaru));
  return { success: true };
}

// Tempat penyiapan (placeholder) integrasi Spreadsheet di masa mendatang
function integrasiSpreadsheetUserMasaDepan() {
  // var ss = SpreadsheetApp.openById("ID_SPREADSHEET_ANDA");
  // Logika pembacaan database user eksternal...
}
