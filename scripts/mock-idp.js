const fs = require('fs');
const path = require('path');
const { IdPConfig, IdPMetadata } = require('saml-idp');

// Generate key pair for the IdP
const key = fs.readFileSync(path.join(__dirname, '../certs/idp-private-key.pem'), 'utf8');
const cert = fs.readFileSync(path.join(__dirname, '../certs/idp-public-cert.pem'), 'utf8');

// Configure the IdP
const idpConfig = new IdPConfig({
  issuer: 'urn:mock-idp',
  signingKey: key,
  signingCert: cert,
  encryptionKey: key,
  encryptionCert: cert,
  userFields: ['email', 'firstName', 'lastName'],
  redirectUrl: 'http://localhost:3000/api/auth/saml/callback',
  postUrl: 'http://localhost:3000/api/auth/saml/callback',
});

// Generate IdP metadata
const metadata = new IdPMetadata(idpConfig).generate();

// Save metadata to a file
fs.writeFileSync(path.join(__dirname, '../certs/idp-metadata.xml'), metadata);

// Start the IdP server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve IdP metadata
app.get('/metadata', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send(metadata);
});

// Handle SSO requests
app.post('/sso', (req, res) => {
  const { SAMLRequest, RelayState } = req.body;
  
  // In a real IdP, this would show a login form
  // For testing, we'll auto-login with a test user
  const user = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    groups: ['Developers'],
  };

  const samlResponse = idpConfig.createResponse({
    nameID: user.email,
    nameIDFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributes: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      groups: user.groups,
    },
    authnContextClassRef: 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
    inResponseTo: SAMLRequest,
    recipient: 'http://localhost:3000/api/auth/saml/callback',
    relayState: RelayState,
  });

  res.send(`
    <html>
      <body>
        <form method="post" action="http://localhost:3000/api/auth/saml/callback">
          <input type="hidden" name="SAMLResponse" value="${samlResponse}" />
          <input type="hidden" name="RelayState" value="${RelayState}" />
          <p>Redirecting to service provider...</p>
          <script>document.forms[0].submit();</script>
        </form>
      </body>
    </html>
  `);
});

const port = 7000;
app.listen(port, () => {
  console.log(`Mock IdP running at http://localhost:${port}`);
  console.log(`Metadata available at http://localhost:${port}/metadata`);
});
