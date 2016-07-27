# Derzeitige Interface Methoden

##Anmerkung zum Ladebildschirm:

Falls euch interessante oder lustige Splash Texts einfallen die man beim Ladebildschirm zeigen könnte, 
sagt Bescheid oder schreibt sie direkt in den splashArray in Interface.js

	
##Level Funtionen:

Zeigt die Leveleinblendung mit @value als Level an.
Das derzeitige Level wird nicht im Interface gespeichert.

	displayLevel(value);
	
	setLevelTimer(seconds);
	
	startLevelTimer();


##Score Funktionen:

Score Counter erhöht Score passiv um 1.
changeScore ändert Score um einen positiven oder negativen Wert.

	startScoreCounter();
	
	stopScoreCounter();
	
	changeScore(value);
	
	setScore(value);
	
	getScore();
	
	
##Geld Funktionen:

changeMoney ändert das Geld um einen positiven oder negativen Wert.

	changeMoney(value);
	
	setMoney(value);
	
	getMoney();


##HP Funktionen:

changeHP ändert HP um einen positiven oder negativen Wert.

	changeHP(value);
	
	setHP(value);
	
	getHP();
	
	setMaxHP(value);
	
	getMaxHP();
	
	
##Waffen Funktionen:
	
Das Weapon Interface zeigt nur die Munition der Sekundärwaffe an.
Diese Funktion sollte immer gerufen werden wenn sich das Display ändern muss.
Zum Beispiel: Waffenwechsel, schießen, Munition einsammeln, nachladen.
*Noch nicht implementiert!*

	updateWeaponInterface();
	

##Speed Funktionen:

	setSpeed(newSpeed);
	
	setMaxSpeed(newMaxSpeed);
	
	
##PowerUp Funktionen:

powerUp ist eine Zahl korrespondierend mit der Leiste von links nach rechts.
removeOrAdd 0 für remove und 1 für add.

	setPowerUp(powerUp, removeOrAdd);
	
	
#Known Bugs:

	HP Bar kann in niedrigen Werten leicht über die Kanten hinaus gehen.
	Theoretisch kann man mit einem sehr häufigen HP Wechsel zwischen 0 und maxHP die displayedHP
	um 1 oder mehr flippen durch die Ungenauigkeit von floats.
=======
# Derzeitige Interface Methoden

##Level Funtionen:

Zeigt die Leveleinblendung mit @value als Level an.
Das derzeitige Level wird nicht im Interface gespeichert.

	displayLevel(value);


##Score Funktionen:

Score Counter erhöht Score passiv um 1.
changeScore ändert Score um einen positiven oder negativen Wert.

	startScoreCounter();
	
	stopScoreCounter();
	
	changeScore(value);
	
	setScore(value);
	
	getScore();
	
	
##Geld Funktionen:

changeMoney ändert das Geld um einen positiven oder negativen Wert.

	changeMoney(value);
	
	setMoney(value);
	
	getMoney();


##HP Funktionen:

changeHP ändert HP um einen positiven oder negativen Wert.

	changeHP(value);
	
	setHP(value);
	
	getHP();
	
	setMaxHP(value);
	
	getMaxHP();
	
	
##Waffen Funktionen:
	
Das Weapon Interface zeigt nur die Munition der Sekundärwaffe an.
Diese Funktion sollte immer gerufen werden wenn sich das Display ändern muss.
Zum Beispiel: Waffenwechsel, schießen, Munition einsammeln, nachladen.
*Noch nicht implementiert!*

	updateWeaponInterface();
	

##Speed Funktionen:

	setSpeed(newSpeed);
	
	setMaxSpeed(newMaxSpeed);
	
	
##PowerUp Funktionen:

powerUp ist eine Zahl korrespondierend mit der Leiste von links nach rechts.
removeOrAdd 0 für remove und 1 für add.

	setPowerUp(powerUp, removeOrAdd);
	
	
##Known Bugs:

HP Bar kann in niedrigen Werten leicht über die Kanten hinaus gehen.
displayedHP kann durch sehr häufige Änderungen zu Werten zwischen 0 und maxHP 
sich um einen oder mehr HP flippen durch die Ungenauigkeit von floats.