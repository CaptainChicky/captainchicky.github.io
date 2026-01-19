# This is the directory auto-hasher
# Auto-hashes all files in a dir except itself and puts it in "hash-list.txt"

$OutputFile = "hash-list.txt"

# Get the files in the current directory
$Files = Get-ChildItem -File

# Prepare the output string
$OutputString = ""

foreach ($File in $Files) {
    # Exclude the script file from the output
    if ($File.Name -ne $MyInvocation.MyCommand.Name) {
        # Get the file name, size, and SHA256 hash
        $FileName = $File.Name
        $FileSizeBytes = $File.Length
        $FileSizeMiB = "{0:F2}" -f ($FileSizeBytes / 1MB)
        $FileHash = Get-FileHash -Path $File.FullName -Algorithm SHA256 | Select-Object -ExpandProperty Hash

        # Append the file information to the output string
        $OutputString += "Name: $FileName`r`n"
        $OutputString += "Size: $FileSizeBytes bytes ($FileSizeMiB MiB)`r`n"
        $OutputString += "SHA256: $FileHash`r`n`r`n"
    }
}

# Write the output string to the file
$OutputString | Out-File -FilePath $OutputFile -Encoding UTF8
