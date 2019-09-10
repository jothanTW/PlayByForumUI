Users:
    Have unique username
    Have icons
    Have icontext
    Have permissions per forum- read/post/edit/edit other/delete/delete other
    Have defined roles as permission sets
    Own threads
    Own posts
    Own characters (character sheet as json object)

Forums:
    Have threads
    Have forums (subforums should have a sublevel max)

Threads: 
    Have posts
    Have game thread boolean

    if game thread-
        Have ooc/ic display options
        Have Map(?s) (usually visible, editable by thread edit permissions and specific user permissions)
        Have notes (always visible, editable by thread edit permissions and specific user permissions)
        Have characters (references to user's characters)
        -- posts, maps, and notes are three divs on same level, can be ordered with css

Posts:
    Display user
    Has text
    has edit history
    has rolls

    if part of game thread-
        Optionally, display character icon/name/current status
        Have ooc text (default text box is ic)
        has character references (as userid/charid then a stat name, ie user:character.sheet.hp)

Characters:
    Have stats as json object
    Has unique id per user
    has name
    Has medium icon, for posts
    Has small icon, for maps
    Has icontext for posts




template formats: