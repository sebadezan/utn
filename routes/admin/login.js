var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');
var md5 = require('md5');  

router.get('/', function (req, res, next) {
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});



router.get('/logout', function (req, res, next){
    req.session.destroy();
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

router.post('/', async (req, res, next) => {
    try {

        console.log(req.body);

        var usuario = req.body.usuario;
        var password = req.body.password;

        var data = await usuariosModel.getUserAndPassword(usuario, password);

        if (data !=undefined) {
            req.session.id_usuario = data.id;
            req.session.nombre = data.usuario;
            
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            });
        }
    } catch (error) {
        console.error('Error en la consulta de usuario:', error);
        res.render('admin/login', {
            layout: 'admin/layout',
            error: 'Error al realizar la consulta'
        });
    }
});


module.exports = router;