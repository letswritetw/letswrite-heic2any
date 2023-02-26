import {imgBase64} from 'imgBase64.js';

document.addEventListener('DOMContentLoaded', async () => {

  // 品質的 slider
  const qaSlider = document.getElementById('quality');
  const qaOutput = document.getElementById('quality-output');
  qaSlider.addEventListener('input', e => {
    qaOutput.textContent = e.target.value;
  });

  // 選擇圖片
  const fileInput = document.getElementById('file');

  fileInput.addEventListener('change', async (e) => {
    const type = document.getElementById('type').value;
    const file = e.target.files[0];
    const result = await heic2any({
      blob: file,
      toType: `image/${type}`,
      quality: +qaSlider.value
    });
    const uri = URL.createObjectURL(result);

    // 執行下載
    const filename = file.name.split('.heic')[0];
    const link = document.createElement('a');
    link.download = `${filename}.${type}`;
    link.href = uri;
    link.click();
    
    // 清空 file input 的值
    fileInput.value = '';
  });

  // 使用預設圖片
  async function placeholderHandler() {
    const type = document.getElementById('type').value;
    const defaultImgBase64 = imgBase64;

    // 方法 1：用 fetch 將 Base64 轉成 blob
    const base64ToBlob = await fetch(defaultImgBase64).then(res => res.blob());

    // 方法 2：用 atob 將 Base64 轉成 blob
    // const base64ToBlob = (base64) => {
    //   const binary = atob(base64.split(',')[1]);
    //   const mime = base64.split(',')[0].match(/:(.*?);/)[1];
    //   const len = binary.length;
    //   const buffer = new ArrayBuffer(len);
    //   const view = new Uint8Array(buffer);
    //   for (let i = 0; i < len; i++) {
    //     view[i] = binary.charCodeAt(i);
    //   }
    //   return new Blob([buffer], { type: mime });
    // };

    const defaultImg = await heic2any({
      blob: base64ToBlob, // 方法 1
      // blob: base64ToBlob(defaultImgBase64), // 方法 2
      toType: `image/${type}`,
      quality: +qaSlider.value
    });

    // 執行下載
    const src = URL.createObjectURL(defaultImg);
    const link = document.createElement('a');
    link.download = `使用預設圖.${type}`;
    link.href = src;
    link.click();
  }
  const placeholderBtn = document.getElementById('placeholder');
  placeholderBtn.addEventListener('click', async e => {
    e.preventDefault();
    await placeholderHandler();
  });

});