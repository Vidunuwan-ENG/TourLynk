Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('frontend\public\Hero.png')
$codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
$jpegCodec = $null
foreach ($c in $codecs) {
    if ($c.MimeType -eq 'image/jpeg') {
        $jpegCodec = $c
        break
    }
}
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]80)
$img.Save('frontend\public\Hero.jpg', $jpegCodec, $params)
$img.Dispose()
Write-Host "Done compressing to Hero.jpg"
