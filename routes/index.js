var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;

router.get('/', async function (req, res, next) {
  novedades = await novedadesModel.getNovedades();
  novedades = novedades.splice(0, 5);
  novedades = novedades.map(novedad => {


    if (novedad.img_id) {
      const imagen = cloudinary.url(novedad.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...novedad,
        imagen
      }
    } else {
      return {
        ...novedad,
        imagen: '/image/noimage.jpg'
      }
    }
  });
  res.render('index', {
    novedades
  });
});

router.post('/', async (req, res, next) => {
  try {
    var { nombre, apellido, dni, telefono, email } = req.body;

    var obj = {
      to: 'sebastiangust7@gmail.com',
      subject: 'Datos de la página web',
      html: `${nombre} ${apellido} se contactó y quiere unirse al gimnasio a través de este correo: ${email}. Este es su teléfono: ${telefono}`
    };

    let transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS
      }
    });

    var info = await transporter.sendMail(obj);
    res.render('index', { message: 'Mensaje enviado correctamente' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.render('index', { message: 'Hubo un error al enviar el mensaje, inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
