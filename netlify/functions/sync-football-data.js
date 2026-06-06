import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY  
)

export async function handler() {
  try {

    const response = await fetch(
      'https://api.football-data.org/v4/competitions/PL/teams',
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY
        }
      }
    )

    const result = await response.json()

    if (!result.teams) {
      throw new Error('No teams returned')
    }

    const teams = result.teams.map(team => ({
      api_team_id: team.id,
      name: team.name,
      country: team.area?.name || '',
      crest_url: team.crest || ''
    }))

    const { error } = await supabase
      .from('teams')
      .upsert(
        teams,
        {
          onConflict: 'api_team_id'
        }
      )

    if (error) {
      throw error
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        teamsInserted: teams.length
      })
    }

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    }

  }
}
