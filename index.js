const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Token real de tu bot "A.D romance"
const BOT_TOKEN = "8628504281:AAEzgd9Ewvy_NbXwKSYPAUiubXiIWP58_w4";

const bot = new Telegraf(BOT_TOKEN);

// Mensaje de bienvenida cuando alguien inicia el bot
bot.start((ctx) => {
  ctx.reply('¡Hola! Soy tu buscador de libros A.D romance. Dime el título o autor que buscas y lo rastrearé en todo internet.');
});

// Lógica para procesar la búsqueda de libros
bot.on('text', async (ctx) => {
  const busqueda = ctx.message.text;
  await ctx.reply(`🔍 Buscando "${busqueda}" en internet... Dame un momento.`);

  try {
    // Búsqueda en la base de datos de Open Library (Internet)
    const urlInternet = `https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda)}&limit=5`;
    const respuesta = await fetch(urlInternet);
    const datos = await respuesta.json();

    let mensajeInternet = "🌐 *Resultados encontrados:*\n\n";
    
    if (datos.docs && datos.docs.length > 0) {
      datos.docs.forEach(libro => {
        const titulo = libro.title || "Sin título";
        const autor = libro.author_name ? libro.author_name.join(', ') : "Autor desconocido";
        const link = libro.key ? `https://openlibrary.org${libro.key}` : "#";
        
        mensajeInternet += `📖 *${titulo}*\n👤 Autor: ${autor}\n🔗 [Ver/Descargar libro](${link})\n\n`;
      });
    } else {
      mensajeInternet = "❌ No encontré ningún libro en internet con ese nombre. Intenta con otro título o autor.";
    }

    await ctx.replyWithMarkdown(mensajeInternet);

  } catch (error) {
    console.error(error);
    await ctx.reply("Vaya, hubo un error al realizar la búsqueda. Inténtalo de nuevo en unos segundos.");
  }
});

// Lanzar el bot
bot.launch().then(() => console.log("¡Bot A.D romance activado con éxito!"));
