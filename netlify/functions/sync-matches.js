
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function handler() {
try {

```
const response = await fetch(
  'https://api.football-data.org/v4/competitions/PL/matches',
  {
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
    }
  }
)

const result = await response.json()

if (!result.matches) {
  throw new Error('No matches returned')
}

const matches = result.matches.map(match => ({
  api_match_id: match.id,

  competition:
    match.competition?.name || 'Premier League',

  home_team:
    match.homeTeam?.name || '',

  away_team:
    match.awayTeam?.name || '',

  match_date:
    match.utcDate,

  status:
    match.status || '',

  home_score:
    match.score?.fullTime?.home ?? null,

  away_score:
    match.score?.fullTime?.away ?? null
}))

const { error } = await supabase
  .from('matches')
  .upsert(matches, {
    onConflict: 'api_match_id'
  })

if (error) {
  throw error
}

return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    matchesInserted: matches.length
  })
}
```

} catch (err) {

```
console.error(err)

return {
  statusCode: 500,
  body: JSON.stringify({
    success: false,
    error: err.message
  })
}
```

}
}
