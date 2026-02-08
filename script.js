let data = JSON.parse(localStorage.getItem("stresData")) || [];

function hitung() {
  let tidur = Number(document.getElementById("tidur").value);
  let jenis = Number(document.getElementById("jenis").value);
  let durasi = Number(document.getElementById("durasi").value);
  let catatan = document.getElementById("catatan").value;
  let emosi = Number(document.getElementById("emosi").value);

  if (!tidur || !durasi || !jenis) {
    document.getElementById("hasil").innerHTML =
      "Lengkapi semua data terlebih dahulu";
    return;
  }

  let skor = 0;

  if (tidur < 5) skor += 3;
  else if (tidur < 7) skor += 2;
  else skor += 1;

  if (jenis === 1) skor += durasi > 6 ? 2 : 1;
  if (jenis === 2) skor += durasi > 4 ? 3 : 2;
  if (jenis === 3) skor += durasi > 2 ? 4 : 3;

  skor += emosi;

  let kondisi =
    skor <= 4 ? "Rendah" :
    skor <= 7 ? "Sedang" : "Tinggi";

  data.push({
    tanggal: new Date().toLocaleDateString(),
    skor: skor,
    kondisi: kondisi,
    catatan: catatan
  });

  localStorage.setItem("stresData", JSON.stringify(data));

  let rata = rataRataMingguan();
  let saran = saranStres(skor);

  document.getElementById("hasil").innerHTML =
    "Indeks Kondisi Mental: <b>" + skor + "</b><br>" +
    "Tingkat Stres: <b>" + kondisi + "</b><br>" +
    "Rata Rata Mingguan: <b>" + rata + "</b><br><br>" +
    "Saran: " + saran;

  tampilRiwayat();
  gambarGrafik();
}

function warnaStres(skor) {
  if (skor <= 4) return "#16a34a";
  if (skor <= 7) return "#facc15";
  return "#dc2626";
}

function rataRataMingguan() {
  if (data.length === 0) return 0;
  let total = data.reduce((a, b) => a + b.skor, 0);
  return (total / data.length).toFixed(1);
}

function saranStres(skor) {
  if (skor <= 4)
    return "Kondisi baik. Pertahankan pola tidur dan aktivitas.";
  if (skor <= 7)
    return "Kurangi aktivitas berat. Perbanyak istirahat dan relaksasi.";
  return "Perlu perhatian. Atur ulang jadwal. Istirahat cukup dan lakukan aktivitas ringan.";
}

function tampilRiwayat() {
  let html = "";
  data.forEach((d, i) => {
    html +=
      (i + 1) + ". " + d.tanggal +
      "<br>Skor: " + d.skor + " (" + d.kondisi + ")" +
      "<br>Catatan: " + (d.catatan || "-") +
      "<hr>";
  });
  document.getElementById("riwayat").innerHTML = html;
}

function gambarGrafik() {
  let c = document.getElementById("grafik");
  let ctx = c.getContext("2d");

  c.width = c.offsetWidth;
  c.height = 260;
  ctx.clearRect(0, 0, c.width, c.height);

  if (data.length === 0) return;

  let padding = 40;
  let maxSkor = 10;
  let chartW = c.width - padding * 2;
  let chartH = c.height - padding * 2;

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, c.height - padding);
  ctx.lineTo(c.width - padding, c.height - padding);
  ctx.stroke();

  for (let i = 0; i <= maxSkor; i += 2) {
    let y = c.height - padding - (i / maxSkor) * chartH;
    ctx.fillText(i, 10, y + 4);
    ctx.beginPath();
    ctx.moveTo(padding - 5, y);
    ctx.lineTo(padding, y);
    ctx.stroke();
  }

  let stepX = chartW / (data.length - 1 || 1);

  data.forEach((d, i) => {
    let x = padding + i * stepX;
    let y = c.height - padding - (d.skor / maxSkor) * chartH;

    if (i > 0) {
      let px = padding + (i - 1) * stepX;
      let py = c.height - padding - (data[i - 1].skor / maxSkor) * chartH;
      ctx.beginPath();
      ctx.strokeStyle = warnaStres(d.skor);
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = warnaStres(d.skor);
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "10px Arial";
    ctx.fillText(d.tanggal, x - 12, c.height - 10);
  });
}

function resetData() {
  localStorage.removeItem("stresData");
  data = [];
  document.getElementById("hasil").innerHTML = "";
  document.getElementById("riwayat").innerHTML = "";
  document.getElementById("infoReset").innerHTML =
    "Data berhasil dihapus";
  gambarGrafik();
}

tampilRiwayat();
gambarGrafik();
