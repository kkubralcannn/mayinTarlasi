let hucreler = [];
let satirSayisi, sutunSayisi, mayinSayisi;
let oyunBittiMi = false;

const zorlukSec = document.getElementById("zorlukSec");
const oyunBaslat = document.getElementById("oyunBaslat");
const oyunAlani = document.getElementById("oyunAlani");
oyunBaslat.addEventListener("click", oyunOlustur);

function oyunOlustur() {

    oyunBittiMi = false;

    oyunAlani.innerHTML = "";// her oyun olusturdugunda tum ekranı temızlememk ıcın 

    const zorluk = zorlukSec.value;
    if (zorluk == "kolay") {
        satirSayisi = 3;
        sutunSayisi = 3;
        mayinSayisi = 1;
    } else if (zorluk == "orta") {
        satirSayisi = 6;
        sutunSayisi = 6;
        mayinSayisi = 6;
    } else {
        satirSayisi = 10;
        sutunSayisi = 10;
        mayinSayisi = 15;
    }

    oyunAlani.style.gridTemplateColumns = `repeat(${sutunSayisi}, 30px)`;
    oyunAlani.style.display = "grid";

    hucreler = [];
    for (let i = 0; i < satirSayisi; i++) {
        for (let j = 0; j < sutunSayisi; j++) {

            const hucre = document.createElement("div");
            hucre.classList.add("hucre");//div de hucreyı alacagım kısmı tanımlıyorum.sınıf acıyorum aslında hucreye
            hucre.dataset.satir = i;
            hucre.dataset.sutun = j;
            hucre.addEventListener("click", hucreyeTikla);
            hucre.addEventListener("pointerdown", bayrakEkleme);
            oyunAlani.appendChild(hucre);//hucreyi olusturdugum dıv hucresının ıcıne eklemem gerekır. Yani oyun alanına 
            hucreler.push({
                satir: i,
                sutun: j,
                element: hucre,
                mayin: false,
                acildi: false,

            });
        }
    }
    mayinlariYerlestir();
}

function mayinlariYerlestir() {
    //bu fonksiyon elımızdeki oyun tahtasına rastgele mayın sayısı kadar hucre yerleştırcek amac bır konuma bırden fazla 
    //mayın yerlesmesın ve mayınSyisi kadar mayını random yerlestırelım her seferınde 
    let yerlesenMayin = 0;
    while (yerlesenMayin < mayinSayisi) {

        //rastgele satır ve sutun numarası secmem lazım 
        const ros = Math.floor(Math.random() * satirSayisi);// 0 dan satirSayisina kadar random secıcek.
        const cos = Math.floor(Math.random() * sutunSayisi);// 0 dan sutunSayisina kadar random secıcek.

        // random koordınatımı hucreler dızısı ıcınde arayıp buldum ve randomHucreye atadım
        const randomHucre = hucreler.find(h => h.satir === ros && h.sutun === cos);

        //bakıyorum randomhucre var ise ve hucrede de mayın yok ise mayın true yapıyorum
        //yanı artık bu hucrede mayın var.yerlestırılenı 1 artırıp ıf den cıkıyorum cunku tek tek bu sekılde kontrol edıyorunm.
        if (randomHucre && !randomHucre.mayin) {
            randomHucre.mayin = true;//mayını yerlestır.
            yerlesenMayin++;//mayını bu koordınata yerlestırdın sayacı 1 artır.
        }
    }
}
//bu bır event fonks hucreye tıklandıgı zaman calısıcak.bu yuzden parametre olarak e yazdım 
// yukarıda oyunuOlustur fonks ıcerısınde addeventlistener clıck olarak cagırıyorum.
function hucreyeTikla(e) {

    //eger oyun daha once bıttıyse ya da mayına bastıysan direk cık.
    if (oyunBittiMi) {
        return;
    }
    const tiklanan = e.target;//kullanıcının tıkladıgı DOM elementını aldık. 
    // target her zaman tıklanan yerı verır.(orn [2,3])

    //hucrenın hangı satır ve sutunda oldugunu ogrenıyoruz.
    const satir = parseInt(tiklanan.dataset.satir); //satır : 2
    const sutun = parseInt(tiklanan.dataset.sutun);//sutun : 3

    const hucre = hucreler.find(h => h.satir === satir && h.sutun === sutun);
    //  cıktı :[{satır: 2 sutun  : 3  mayin :false acildi : false}] 

    if (hucre.acildi) return;
    // eger bu hucre zaten daha once acılmıssa tekrar işlem yapma. Boylece tıklanan hucre tekrar acılamaz.



    //hucre artık acıldı.
    hucre.acildi = true;
    tiklanan.style.backgroundColor = "#ac69c9ff";


    // eger hucre mayınlı ıse 
    if (hucre.mayin) {
        tiklanan.textContent = "💣";// tıklanan hucrenın ıcerıgını bomba yap
        tiklanan.style.backgroundColor = "#530768ff";
        oyunBittiMi = true;
        alert("oyun bitti! Mayina bastin!");

        hucreler.forEach(h => {
            if (h.mayin) { h.element.textContent = "💣"; }//h.element o hucreye baglı html elementı
        });

        return;
    }


    const komsuMayinSayisi = komsuMayinSayisiBul(satir, sutun);
    //hucrenın komsularında mayın var ıse bu hucreye yazılır
    if (komsuMayinSayisi === 0) {
        tiklanan.style.backgroundColor = "#d1d3ccff"//komsusunda 0 mayın olan yanı toprak alalnın rengını yesıl yapcak 

    }
    if (komsuMayinSayisi > 0) {
        tiklanan.textContent = komsuMayinSayisi;

    }
    oyunuKazandinMi();
}


function bayrakEkleme(e) {

    //sag tıklama ile bayrak koyma ıslemı.F
    if (e.pointerType == 'mouse' && e.button === 2) {//fare ile mı tıklanmıs ve sag tık mı ?
        e.preventDefault();
        e.target.classList.add("bayrak");//div de bayrak ıcın alan acıyorum sınıf acıyorum gıbı dusun 
        e.target.textContent = "🚩";
        oyunuKazandinMi();
    }

}



function komsuMayinSayisiBul(satir, sutun) {

    let sayac = 0;//etraftakı mayın sayısını tutcak degısken 

    // -1, 0, +1 farkları ile 8 komşuyu kontrol et
    //3x3 lük cerceveyı dolanmıs olduk.
    //ust satır alt satır kendı satırım
    //sag sutun sol sutun kendı sutunum 
    //0,0 zaten kendı tıkladıgım hucre 
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // Kendisi olan hücreyi atla (çünkü komşu değil)
            if (i === 0 && j === 0) continue;

            const komsuSatir = satir + i;
            const komsuSutun = sutun + j;
            //bu koordınatlara ait komsu hucreyı hucrelerın ıcınden find ıle buldum
            const komsuHucre = hucreler.find(h => h.satir === komsuSatir && h.sutun === komsuSutun);

            if (komsuHucre && komsuHucre.mayin) {
                sayac++;
            }
        }
    }
    return sayac;
}

//hucreye tıkla ve bayrak ekle fonks cagırmam lazım 
function oyunuKazandinMi() {
    if (oyunBittiMi) return;
    //tüm mayınlı hucrelere bayrak konmus mu??
    const tumMayinlarBayrakliMi = hucreler.filter(h => h.mayin).every(h => h.element.classList.contains("bayrak"));
    //mayınsız olan tum hucreler acılmıs mı?
    const tumAcilmasiGerekenlerAcildiMi = hucreler.filter(h => !h.mayin).every(h => h.acildi);

    //her ıkısını de saglıyosa kazandı
    if (tumAcilmasiGerekenlerAcildiMi && tumMayinlarBayrakliMi) {
        oyunBittiMi = true;
        alert("TEBRİKLER OYUNU KAZANDINIZ!!");
    }

}