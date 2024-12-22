const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function testSAMLSetup() {
  console.log('Starting SAML SSO test...');

  try {
    // 1. Create a test team if not exists
    console.log('\n1. Creating test team...');
    const teamResponse = await fetch('http://localhost:3000/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Team',
        slug: 'test-team',
      }),
    });

    if (!teamResponse.ok) {
      throw new Error(`Failed to create team: ${await teamResponse.text()}`);
    }

    const team = await teamResponse.json();
    console.log('Team created:', team);

    // 2. Configure SAML SSO for the team
    console.log('\n2. Configuring SAML SSO...');
    const metadata = fs.readFileSync(path.join(__dirname, '../certs/idp-metadata.xml'), 'utf8');
    
    const ssoResponse = await fetch(`http://localhost:3000/api/teams/${team.id}/sso/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enabled: true,
        idpMetadata: metadata,
        tenant: team.id,
        product: 'blueprint-club',
      }),
    });

    if (!ssoResponse.ok) {
      throw new Error(`Failed to configure SSO: ${await ssoResponse.text()}`);
    }

    console.log('SSO configured successfully');

    // 3. Test SSO login
    console.log('\n3. Testing SSO login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/saml/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant: team.id,
        product: 'blueprint-club',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Failed to initiate login: ${await loginResponse.text()}`);
    }

    const { url } = await loginResponse.json();
    console.log('Login URL:', url);
    console.log('\nTest completed successfully!');
    console.log('\nTo test the full flow:');
    console.log('1. Start the application: npm run dev');
    console.log('2. Start the mock IdP: npm run mock-idp');
    console.log('3. Visit the login URL in your browser');
    
  } catch (error) {
    console.error('\nTest failed:', error);
    process.exit(1);
  }
}

testSAMLSetup();
