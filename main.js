const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("repo-token");
const directory = core.getInput("directory");
  
const octokit = github.getOctokit(token);


const run = async () => {

    try{
        let regExp = RegExp(directory)

        console.log(`Raw input: ${directory}`)
        console.log(`Regex: ${regExp.toString()}`)
        
        let response = await octokit.rest.repos.compareCommitsWithBasehead()

        let filteredFiles = (response.data.files || []).filter(file => {
            console.log(JSON.parse(file))
            return regExp.test(file.filename)
        })

        if(filteredFiles.length == 0){
            console.log("No matchs found.")
            console.log(`Raw input: ${directory}`)
            console.log(`Regex: ${regExp.toString()}`)
            return false
        } 

        console.log(`Found a total of ${filteredFiles.length} matches`)

        return true

    }catch(e){
        console.log("FAIL", e)
    }
        
}

run()