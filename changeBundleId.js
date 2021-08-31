const fs = require('fs');

const oldBundleId = process.argv[2];
const newBundleId = process.argv[3];
const newVersion = process.argv[4];
const filesWithBundleId = [
  './android/app/build.gradle',
  './android/app/BUCK',
  './android/app/google-services.json',
  './android/app/src/main/AndroidManifest.xml',
  './android/app/src/main/java/com/simtech/multivendor/MainApplication.java',
  './android/app/src/main/java/com/simtech/multivendor/MainActivity.java',
];

for (let i = 0; i < filesWithBundleId.length; i++) {
  fs.readFile(filesWithBundleId[i], 'utf8', (err, data) => {
    if (err) {
      return console.log('Read file error: ', err);
    }

    const reg = new RegExp(oldBundleId, 'g');
    const result = data.replace(reg, newBundleId);

    fs.writeFile(filesWithBundleId[i], result, 'utf8', (err) => {
      if (err) {
        return console.log('Write file error: ', err);
      }
    });
  });
}

fs.readFile('./android/app/build.gradle', 'utf8', (err, data) => {
  if (err) {
    return console.log('Read file error: ', err);
  }

  const result1 = data.replace('versionCode 1', `versionCode ${newVersion}`);
  const result2 = result1.replace(
    'versionName "1.0"',
    `versionName "${newVersion}.0"`,
  );

  fs.writeFile('./android/app/build.gradle', result2, 'utf8', (err) => {
    if (err) {
      return console.log('Write file error: ', err);
    }
  });
});
