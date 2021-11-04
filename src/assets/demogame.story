scene morning
bg 道02.png
bgm 01.ogg
set count 0
label start

actor Cirno Daiyousei

text Cirno: Good morning!
Daiyousei: Good morning!

Cirno: Let me ask you a question: 1+1=?
label q1
choice 2 q1wrong 3 q1pass
label q1wrong
Cirno: Wrong! Another try~ 1+1=?
goto q1
label q1pass
Cirno: That's it!

Cirno: Another question: 3+6=?
label q2
choice 8 q2wrong 9 q2pass
label q2wrong
Cirno: Wrong! Another try~ 3+6=?
goto q2
label q2pass
Cirno: That's it!

text end
