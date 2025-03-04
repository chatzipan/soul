const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: __dirname + "/./../.env" });

const { JWT } = require("google-auth-library");
const keys = JSON.parse(fs.readFileSync("./elite.json", "utf8"));
const client = new JWT({
  email: keys.client_email,
  key: keys.private_key,
  scopes: [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/business.manage",
  ],
  subject: "v.chatzipanagiotis@soulzuerich.ch",
});

async function saveGoogleMenu() {
  const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  await client.request({ url });

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  await client.getTokenInfo(client.credentials.access_token);

  const accountsRequest = await fetch(
    `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?access_token=${client.credentials.access_token}`,
  );

  const { accounts } = await accountsRequest.json();
  const accountId = accounts[0].name;

  const locationsRequest = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations?readMask=storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours&access_token=${client.credentials.access_token}`,
  );

  const { locations } = await locationsRequest.json();
  const locationId = locations[0].name;

  const menu_endpoint = `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/foodMenus?access_token=${client.credentials.access_token}`;

  // const storedMenuResponse = await fetch(
  //   "https://storage.googleapis.com/soulzuerich.ch/menu.json",
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }
  // );

  // const storedMenu = await storedMenuResponse.json();
  const storedMenu = JSON.parse(fs.readFileSync("./static/menu.json", "utf8"));

  const googleMenu = {
    menus: [
      {
        labels: {
          displayName: "All Day Menu",
          languageCode: "en",
        },
        sections: storedMenu.map((section) => {
          return {
            labels: {
              displayName: section.name,
              languageCode: "en",
            },
            items: section.entries.map((entry) => {
              return [
                {
                  labels: {
                    displayName: entry.name,
                    languageCode: "en",
                  },
                  attributes: {
                    price: {
                      currencyCode: "CHF",
                      units: Math.floor(entry.price),
                      nanos: Math.round((entry.price % 1) * 1000000000),
                    },
                  },
                },
              ];
            }),
          };
        }),
      },
    ],
  };

  try {
    const response = await fetch(menu_endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(googleMenu),
    });
    console.log("New Menu Saved!", await response.json());
  } catch (error) {
    console.log("error", error);
  }
}

saveGoogleMenu();
