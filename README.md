# directory-changes-checker

Action to find out rather a directory had changes or not in last commit
Looks for the list of files changed in the last commit. If given directory is present in the changes it returns true, otherwise, returns false

eg: *directory*: **"checker"**

      -*my/dir/file.exe* is not a match
      -*test/my-checker/* is not a match
      -*test/my/checker/* is a match
      -*checker/subfolder* is a match



steps:
```yaml
      - name: Check if directory has changes
        id: directory_changes_checker
        uses: georgeneto/directory-changes-checker
        with:
          repo-token: ${{secrets.GITHUB_TOKEN}}
          directory: "{REPLACE_BY_DIRECTORY_NAME}"
```          
          
and the boolean output may be used as:
${{ steps.directory_changes_checker.outputs.hasChanges }} 
