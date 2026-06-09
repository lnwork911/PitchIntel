export async function handler() {

try {

const base =
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL;

const syncResponse =
  await fetch(
    `${base}/.netlify/functions/sync-matches`
  );

const storyResponse =
  await fetch(
    `${base}/.netlify/functions/generate-story`
  );

const briefingResponse =
  await fetch(
    `${base}/.netlify/functions/generate-briefing`
  );

const sync =
  await syncResponse.json();

const story =
  await storyResponse.json();

const briefing =
  await briefingResponse.json();

return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    sync,
    story,
    briefing
  })
};

} catch (error) {

return {
  statusCode: 500,
  body: JSON.stringify({
    success: false,
    error: error.message
  })
};


}
}
