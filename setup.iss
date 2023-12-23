#define AppName "chato"
#define AppVersion "0.0.1"
#define AppPublisher "dani@gatunes"
#define AppURL "https://github.com/danielesteban/chato"
#define AppExeName "chato"

[Setup]
AppId={{AB637A65-2A8A-4B47-8538-68F29BC5473D}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}
DefaultDirName={autopf}\{#AppName}
DisableDirPage=auto
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputBaseFilename={#AppExeName}-v{#AppVersion}
OutputDir=.
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "chato-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExeName}.exe"

[Run]
Filename: "{app}\{#AppExeName}.exe"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall skipifsilent
