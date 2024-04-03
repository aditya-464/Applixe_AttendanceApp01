import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

export const excelToJson = async fileUri => {
  try {
    const data = await RNFS.readFile(fileUri, 'base64');
    const workbook = XLSX.read(data, {type: 'base64'});

    // Log the content of the workbook
    // console.log('Workbook:', workbook);

    const jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      {header: 1},
    );

    // Log the content of the jsonData
    // console.log('JSON Data:', jsonData);

    return jsonData;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};
