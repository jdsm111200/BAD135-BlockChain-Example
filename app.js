const SHA256 = require("crypto-js/sha256");
let sistema = {
  blockChain: [],
  dificultad: "000",
  crearGenesis: function () {
    let genesis = this.crearBloque("Bloque Genesis", "");
    genesis.hash = this.crearHash(genesis);
    this.blockChain.push(genesis);
  },
  crearBloque: function (datos, prevHash) {
    let bloque = {
      index: this.blockChain.length + 1,
      fecha: new Date(),
      datos: datos,
      prevHash: prevHash,
      hash: "",
      nonce: 0,
    };
    return bloque;
  },
  crearHash: function (bloque) {
    return SHA256(bloque.index + bloque.fecha + JSON.stringify(bloque.datos) + bloque.prevHash + bloque.nonce)
    .toString();
  },
  agregarBloque: function (datos) {
    console.log("Agregando Bloque");
    let prevHash = this.blockChain[this.blockChain.length - 1].hash;
    let bloque = this.crearBloque(datos, prevHash);
    //minado
    bloque = this.minarBloque(bloque);
    this.blockChain.push(bloque);
  },
  minarBloque: function (bloque) {
    while (!bloque.hash.startsWith(this.dificultad)) {
      bloque.nonce++;
      bloque.hash = this.crearHash(bloque);
    }
    console.log("Bloque minado");
    return bloque;
  },
  validarCadena: function () {
    for (let i = 1; i < this.blockChain.length; i++) {
      let prevBloque = this.blockChain[i - 1];
      let currBloque = this.blockChain[i];
      if (currBloque.prevHash != prevBloque.hash) {
        console.log("Error de Hash Previo en el bloque: " + currBloque.index);
        return false;
      }
      if (currBloque.hash != this.crearHash(currBloque)) {
        console.log("El hash no coincide");
        return false;
      }
    }
    return true;
  },
};
sistema.crearGenesis();
sistema.agregarBloque({ voto: "A" });
sistema.agregarBloque({ voto: "B" });
sistema.agregarBloque({ voto: "C" });
sistema.agregarBloque({ voto: "D" });
console.log(sistema.validarCadena());
console.log("Se modifica un bloque");
sistema.blockChain[3].datos.voto = "A";
console.log(sistema.validarCadena());
console.log(sistema.blockChain);
