import gql from 'graphql-tag'


//user list 
export const USERS_LIST = gql`
  query UserList {
  user {
      id
      name
      email
    }
  }
`

export const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    user(where: {email: {_eq: $email}}) {
      id
      name
    }
  }
`;
//list of user's organiztion
export const getUserOrganization = gql`
  query getOganization {
    organization {
      id
      logo
      name
      same_as_team
      admin {
        id
        email
      }
      organization_members {
        user {
          id
          name
          email
        }
      }
      teams {
        id
        name
        logo
        admin_id
        team_members {
          user {
            id
            name
            email
          }
        }
      }
    }
  }
  `
  
  //list of user's organization members
export const GET_ORG_MEMBERS = gql`
  query getOrganizationMemberByOrgID($org_id: uuid!) {
    organization_member(where: {organization_id: {_eq: $org_id}}) {
      organization_id
      user {
        id
        name
        email
      }
    }
  }
` 

// User's Team List
export const GET_USER_TEAM = gql`
  query getUserTeam {
    team {
      id
      logo
      name
      organization_id
      admin {
        id
        name
        email
      }
      dictionary_permission {
        id
        dictionary_id
        team_id
      }
      team_members {
        user {
          id
          name
          email
        }
      }
    }
  }
`
export const GET_TEAM_BY_ORG_PK= gql`
  query getTeamByOrgPK($org_id: uuid!) {
    team(where: {organization_id: {_eq: $org_id}}) {
      id
      logo
      name
      organization_id
      admin {
        id
        name
        email
      }
      dictionary_permission {
        id
        dictionary_id
        team_id
      }
      team_members {
        user {
          id
          name
          email
        }
      }
    }
  }
`

//get Team by PK
export const GET_TEAM_BY_PK = gql`
  query getTeamByPK($team_id: uuid!) {
    team_by_pk(id: $team_id) {
      id
      name
      logo
      organization_id
      admin {
        id
        name
        email
        team_members {
          user {
            id
            name
            email
          }
        }
      }
      dictionary_permission {
        id
        team_id
        dictionary_id
      }
    }
  }
`

// get Team's members 
export const GET_TEAM_MEMBER_BY_TEAM_PK = gql`
  query getTeamByPk($team_id: uuid!) {
    team_member(where: {team_id: {_eq: $team_id}}) {
      team_id
      user {
        id
        name
        email
      }
    }
  }
`

//Get user dictionary
export const GET_DICTIONARIES = gql`
  query getUserDictionary {
    data_dictionary {
      id
      name
      access_mode
      target
      source
      organization_id
      dictionary_permissions {
        id
        team_id
        team {
          name
        }
      }
    }
  }
`

// GET Dictionary PERMISSION
export const GET_DICTIONARY_PERMISSION = gql`
  query getDictionaryPermissionByPK($id: uuid!) {
    dictionary_permission_by_pk(id: $id) {
      id
      dictionary_id
      team {
        id
        logo
        name
        organization_id
      }
    }
  }
  
`

// Dictionary Access Mode
export const GET_DICTIONARY_ACCESS_MODE = gql`
  query getDictionaryAccessMode {
    data_access_mode {
      value
      comment
    }
  }
`

// Dictionary Access Mode
export const GET_LANGUAGES = gql`
  query language {
    data_language {
      value
      comment
    }
  }
`

//Exact search 
export const EXACT_SEARCH = gql`
  query ExactSearch($word: String!) {
    data_words(where: {word: {_eq: $word}}) {
      id
      word
      descriptions {
        description
        language
      }
    }
  }
  `

  //Partial search 
export const PARTIAL_SEARCH = gql`
query partialSearch($word: String!) {
  data_words(where: {word: {_ilike: $word}}) {
    id
    word
    descriptions {
      description
      language
    }
  }
}
`