scene morning
bg 道02.png
bgm 01.ogg
set count 0
label start
text Cirno: Good morning!
Daiyousei: Good morning!
text Cirno: 1+1=?
choice 1 start 2 start 3 start 9 start
add count 1
goto start if count<3
text end
