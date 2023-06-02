const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const { profile } = require('console');

const app = express();

// Configuration de la session
app.use(session({
  secret: 'votre-secret-de-session',
  resave: false,
  saveUninitialized: false
}));

// Middleware pour parser les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Lecture du fichier JSON contenant les utilisateurs et les mots de passe
const usersData = fs.readFileSync('users.json');
const users = JSON.parse(usersData);

// Middleware pour vérifier l'authentification de l'utilisateur
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};

// Page d'accueil (accessible uniquement aux utilisateurs authentifiés)
app.get('/', isAuthenticated, (req, res) => {
    const filePath = '/Users/Asma ZAGMOUZI/Etudes/INPT ASEDS INE2/sec-project/dashboard.html';
    res.sendFile(filePath);
});

// Page de connexion
app.get('/login', (req, res) => {
    const filePath = '/Users/Asma ZAGMOUZI/Etudes/INPT ASEDS INE2/sec-project/login.html';
    res.sendFile(filePath);
});

// Gestion de la soumission du formulaire de connexion
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Recherche de l'utilisateur dans la liste
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    //res.send('Nom d\'utilisateur ou mot de passe incorrect');
    res.send(`
      <script>
        window.onload = function() {
          document.getElementById('alert-msg').classList.remove('hidden');
        };
      </script>
      <a href="/">Retour à la page de connexion</a>
    `);
  }
});

// Déconnexion de l'utilisateur
app.get('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  res.redirect('/login');
});

// app.get('/Profil', (req, res) => {
//     const page = 'Profil.html';
//     if (req.session.isAuthenticated){
//       res.sendFile(`${page}`, { root: __dirname + '/' }, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(404).send('Page not found');
//           }
//       });
//     }
// });

// app.get('/Parametres', (req, res) => {
//   const page = 'Paramètres.html';
//   if (req.session.isAuthenticated){
//     res.sendFile(`${page}`, { root: __dirname + '/' }, (err) => {
//       if (err) {
//           console.error(err);
//           res.status(404).send('Page not found');
//         }
//     });
//   }
// });
// app.get('/profile-picture.jpg', (req, res) => {
//   const page = 'profile-picture.jpg';
//   res.sendFile(`${page}`, { root: __dirname + '/' })
// });


//La fonction qui crée la vulnerabilité
app.get('/:nomPage', (req, res) => {
  const nomPage = req.params.nomPage;
  if (req.session.isAuthenticated){
     res.sendFile(`${nomPage}`, { root: __dirname + '/' }, (err) => {
      if (err) {
        console.error(err);
        res.status(404).send('Page not found');
      }
    });
 }
});
// Port d'écoute du serveur
const port = 3000;

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
