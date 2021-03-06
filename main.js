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
        
        let response = await octokit.rest.repos.compareCommits({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            base: "HEAD^",
            head: "HEAD"
        })

        let filteredFiles = (response.data.files || []).filter(file => {
            let isMatch = regExp.test(file.filename)
            console.log(`[${isMatch && '[** match **]'} ${file.filename}`)
            return isMatch
        })

        if(filteredFiles.length == 0){
            console.log("No matchs found.")
            console.log(`Raw input: ${directory}`)
            console.log(`Regex: ${regExp.toString()}`)
            core.setOutput("hasChanges", false)
        } 

        console.log(`Found a total of ${filteredFiles.length} matches`)

        core.setOutput("hasChanges", true)

    }catch(e){
        console.log("FAIL", e)
    }
        
}

run()