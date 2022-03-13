import { toBlob } from 'html-to-image';


function downloadAsImage(element) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  toBlob(element)
    .then(function (blob) {
      const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "bos-page.png";
        a.click();
        window.URL.revokeObjectURL(url);
  });
}
export {downloadAsImage}