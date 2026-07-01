const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Token real de tu bot "AD romance"
const TOKEN_BOT = "8628504281:AAEzgd9Ewvy_NbXwK5E_Fw8zYv6W5U_7p8Q"; 

const bot = new Telegraf(TOKEN_BOT);

// Mensaje de bienvenida cuando alguien inicia el bot
bot.start((ctx) => {
  ctx.reply('¡Hola! Soy tu buscador de libros AD romance.');
});

// Lógica para procesar la búsqueda de libros
bot.on('text', async (ctx) => {
  const busqueda = ctx.message.text;
  await ctx.reply(`🔍 Buscando "${busqueda}"...`);

  try {
    // Búsqueda en la base de datos de Open Library
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda)}`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (datos.docs && datos.docs.length > 0) {
      let mensaje = "📚 **Libros encontrados:**\n\n";
      // Tomamos los primeros 5 resultados
      const libros = datos.docs.slice(0, 5);
      
      libros.forEach((libro, index) => {
        const titulo = libro.title || "Sin título";
        const autor = libro.author_name ? libro.author_name.join(', ') : "Autor desconocido";
        const año = libro.first_publish_year || "Año desconocido";
        mensaje += `${index + 1}. **${titulo}**\n✍️ Autor: ${autor}\n📅 Año: ${año}\n\n`;
      });
      
      await ctx.reply(mensaje);
    } else {
      await ctx.reply("❌ No encontré ningún libro con ese nombre.");
    }
  } catch (error) {
    console.error(error);
    await ctx.reply("⚠️ Hubo un error al realizar la búsqueda. Inténtalo más tarde.");
  }
});

// Lanzar el bot
bot.launch().then(() => {
  console.log("Bot en funcionamiento...");
}).catch((err) => {
  console.error("Error al iniciar el bot:", err);
});
