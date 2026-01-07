export function generateVietQRUrl(amount, email, addInfo = "PURCHASE-POINT") {
  const baseUrl = "https://img.vietqr.io/image";
  const bankCode = "vcb";
  const accountNumber = "1039500129";
  const accountName = "TRAN NHAT DUONG";
  const info = addInfo + '-' + email;
  const params = new URLSearchParams({
    amount: amount.toString(),
    addInfo: info,
    accountName: accountName
  });

  return `${baseUrl}/${bankCode}-${accountNumber}-compact2.png?${params.toString()}`;
}
