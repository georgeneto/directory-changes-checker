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

        
        console.log(JSON.stringify(response.data))
        console.log(JSON.stringify(response.data.files))

        let filteredFiles = (response.data.files || []).filter(file => {
            console.log(JSON.stringify(file))
            return regExp.test(file.filename)
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