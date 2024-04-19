const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
const wallet = new solanaWeb3.Keypair(); // Use a secure method to load wallet keys in production

async function getLivePrices() {
  const prices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=runestone,zeus&vs_currencies=usd');
  const data = await prices.json();
  document.getElementById('priceDisplay').innerText = `Runestone: $${data.runestone.usd}, Zeus: $${data.zeus.usd}`;
}

async function initiateSwap() {
  const jupiterProvider = new JupiterProvider({ connection, wallet, cluster: 'mainnet-beta' });
  const { routes } = await jupiterProvider.computeRoutes({
    inputMint: new solanaWeb3.PublicKey('AAXzWyHFErx9MzgiDKSxRZ14VAYjW7Pv6xEqpnSLXPL9'),
    outputMint: new solanaWeb3.PublicKey('ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq'),
    inputAmount: 1000000,
    slippage: 1,
  });
  if (routes.length) {
    const swapResult = await jupiterProvider.swap({ route: routes[0] });
    document.getElementById('swapStatus').innerText = 'Swap Completed: ' + swapResult.transactionId;
  } else {
    document.getElementById('swapStatus').innerText = 'No swap routes available.';
  }
}

getLivePrices(); // Call on load to display prices
