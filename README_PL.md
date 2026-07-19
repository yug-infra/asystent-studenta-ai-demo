# Asystent Studenta AI Demo

Publiczna demonstracja prototypu asystenta studenta AI dla procesu pracy z planem zajec w Microsoft Teams.

## Czym jest ten projekt

To repozytorium jest osobna wersja demonstracyjna przygotowana do publicznego pokazania prototypu. Docelowo projekt nie jest oddzielnym portalem studenta, lecz warstwa pomocnicza dla przegladarki: desktopowy plugin albo nakladka na strone Microsoft Teams, gdy uzytkownik jest juz zalogowany w Teams.

Taki model pozwala budowac pomocniczy interfejs bez przejmowania logowania od Microsoftu. Uzytkownik pozostaje w swoim normalnym srodowisku Teams, a asystent pomaga szybciej znalezc informacje zwiazane z zajeciami.

## Co dziala teraz

W obecnej wersji prototypu dziala modul planu zajec:

- wyswietlanie danych planu zajec;
- filtrowanie i porzadkowanie informacji;
- przygotowanie interfejsu, ktory moze byc wykorzystany jako nakladka na Teams;
- demonstracja przejscia z planu zajec do kontekstu zespolu w Microsoft Teams.

Czesc AI jest w tej publicznej wersji warstwa demonstracyjna. Pokazuje proponowany sposob interakcji, sceny wizualne i kierunek rozwoju, ale nie jest jeszcze polaczona z produkcyjnym API AI ani z Microsoft Graph.

## Uwaga dotyczaca danych planu

Publiczny zestaw danych planu zajec zostal przygotowany przez polautomatyczne parsowanie materialu zrodlowego prototypu. Odwolania do Excela, identyfikatory komorek i inne techniczne slady zrodla zostaly celowo usuniete z repozytorium. Poniewaz parsowanie bylo polautomatyczne, czesc wpisow moze wymagac recznej weryfikacji.

## Wartosc dla studentow i prowadzacych

Glownym uzytkownikiem prototypu jest student, ale ten sam modul planu moze pomoc rowniez prowadzacym. Wykladowca moze szybciej sprawdzic, gdzie i kiedy ma zaplanowane zajecia, z ktorymi grupami pracuje oraz jaki kontekst Teams powinien otworzyc jako nastepny.

## Kierunek rozwoju

W kolejnych etapach projekt moze zostac rozszerzony o:

- sledzenie zadan i materialow z Microsoft Teams;
- integracje z materialami on-demand;
- integracje z Moodle lub podobnym systemem LMS;
- podlaczenie realnych adapterow API zamiast adapterow demonstracyjnych;
- lokalny cache dla rozszerzenia przegladarki.

## Dlaczego Vanilla JavaScript

Prototyp celowo zostal przygotowany w Vanilla JavaScript, bez Reacta i bez dodatkowego frameworka frontendowego.

Celem tej wersji jest pokazanie mechaniki, architektury i decyzji projektowych w sposob widoczny dla osoby oceniajacej. Framework moze przyspieszyc prace, ale czesto ukrywa przeplyw danych i odpowiedzialnosci za gotowymi abstrakcjami.

W tej wersji latwiej ocenic:

- jak zorganizowany jest stan aplikacji;
- gdzie znajduje sie logika domenowa;
- gdzie sa adaptery UI i adaptery integracyjne;
- jak mozna wymienic warstwe demonstracyjna na realne API;
- jak prototyp moze przejsc w dzialajace narzedzie.

## Architektura

Frontend jest ulozony w stylu lekkiej architektury heksagonalnej oraz DDD:

- `domain` - pojecia domenowe zwiazane z planem zajec i demonstracja AI;
- `application` - przypadki uzycia, serwisy i fasady aplikacyjne;
- `adapters` - renderowanie UI oraz punkty przyszlej integracji;
- `shared` - wspolne mechanizmy, na przyklad lokalizacja.

Czesc adapterow jest obecnie adapterami demonstracyjnymi lub stubami. Jest to swiadoma decyzja projektowa: adapter wyznacza miejsce, w ktorym pozniej mozna podlaczyc prawdziwy kod integracyjny bez przepisywania logiki domenowej.

## Dokumentacja

Dokumentacja techniczna bedzie rozwijana w plikach Markdown. Diagramy w README moga byc zapisane jako Mermaid, poniewaz GitHub renderuje je bezposrednio. Zrodla PlantUML moga byc przechowywane osobno w `docs/diagrams`, a w razie potrzeby mozna dodac wygenerowane pliki SVG lub PNG.

## Licencja i wykorzystanie

Repozytorium jest opublikowane jako publiczna demonstracja prototypu do celow edukacyjnych i konkursowych.

All rights reserved. Kod zrodlowy, koncepcja UI, dokumentacja oraz materialy prototypu nie moga byc kopiowane, ponownie wykorzystywane, rozpowschniane ani uzywane jako podstawa prac pochodnych bez pisemnej zgody autora.
