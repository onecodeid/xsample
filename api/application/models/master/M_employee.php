<?php

class M_Employee extends MY_Model
{
    function __construct()
    {
        parent::__construct();

        $this->table_name = "m_employee";
        $this->table_as = 'employee';

        $tname = $this->table_name;
        $tas = $this->table_as;

        $this->table_key = $tname."ID";
        $this->table_field = array(
            ['field'=>$tname.'ID','as'=>$tas.'_id'],
            ['field'=>$tname.'M_PositionID','as'=>$tas.'_positionid'],
            ['field'=>$tname.'Code','as'=>$tas.'_code'],
            ['field'=>$tname.'Name','as'=>$tas.'_name'],
            ['field'=>$tname.'DOB','as'=>$tas.'_dob'],
            ['field'=>$tname.'Address','as'=>$tas.'_address'],
            ['field'=>$tname.'M_CityID','as'=>$tas.'_cityid'],
            // ['field'=>$tname.'M_ContactID','as'=>$tas.'_contactid'],
            ['field'=>$tname.'JoinDate','as'=>$tas.'_joindate'],
            ['field'=>$tname.'Note','as'=>$tas.'_note']
        );
        $this->table_field_search = $tname."Name";
        $this->table_field_sort = $tname."Code";
        $this->table_field_active = $tname."IsActive";
    }

    function search( $d )
    {
        $limit = isset($d['limit']) ? $d['limit'] : 10;
        $offset = ($d['page'] - 1) * $limit;
        $l = ['records'=>[], 'total'=>0, 'total_page'=>1];
        $f = "";
        $af = $this->table_field;
        for($x=0;$x<count($af);$x++)
        {
            $f .= ($x!=0) ? ', ' : '';
            $f .= $af[$x]['field'] . ' as '. $af[$x]['as'];
        }
        $q = "
            SELECT $f 
                , m_position.M_PositionName as ".$this->table_as."_position
                , concat(M_CityName,' - ',M_ProvinceName) as ".$this->table_as."_city
                , m_contact.M_ContactName as ".$this->table_as."_contact,
                IFNULL(M_ProvinceID, 0) province_id
            FROM `{$this->table_name}`
            LEFT OUTER JOIN m_position ON ".$this->table_name."M_PositionID = M_PositionID and M_PositionIsActive = 'Y'
            LEFT OUTER JOIN m_city ON ".$this->table_name."M_CityID = M_CityID and M_CityIsActive = 'Y'
            LEFT OUTER JOIN m_province ON M_CityM_ProvinceID = M_ProvinceID and M_ProvinceIsActive = 'Y'
            LEFT OUTER JOIN m_contact ON M_EmployeeM_ContactID = M_ContactID and M_ContactIsActive = 'Y'
            WHERE `$this->table_field_search` LIKE ?
            AND `$this->table_field_active` = 'Y'
            ORDER BY `$this->table_field_sort` asc
            LIMIT {$limit} OFFSET {$offset}
        ";
        $r = $this->db->query($q, [$d['search']]);
        if ($r)
        {
            $l['records'] = $r->result_array();
        }
        $qall = "
            SELECT count(`{$this->table_key}`) n
            FROM `{$this->table_name}`
            WHERE `$this->table_field_search` LIKE ?
            AND `$this->table_field_active` = 'Y'
        ";
        $r = $this->db->query($qall, [$d['search']]);
        if ($r)
        {
            $l['total'] = $r->row()->n;
            $l['total_page'] = ceil($r->row()->n / $limit);
        }
        return $l;
    }

    function save ( $d, $id = 0)
    {
        $fa = $this->table_field;
        unset($fa[0]);
        $f = array();
        for($x=1;$x<=count($fa);$x++)
        {
            $f[$fa[$x]['field']] = $d[$fa[$x]['as']];
        }
        $this->db->set($f);
    
        if ($id != 0) {
            $r = $this->db->where($this->table_key, $id)
                    ->update( $this->table_name );
        }
    
        else {
            $r = $this->db->insert( $this->table_name );
            $id = $this->db->insert_id();
        }

        if ($r)
            return (object) ["status"=>"OK", "data"=>$id, "query"=>$this->db->last_query()];
        return (object) ["status"=>"ERR"];
    }

    function del ($id)
    {
        $this->db->set('M_EmployeeIsActive', 'N')
                ->where('M_EmployeeID', $this->sys_input['id'])
                ->update($this->table_name);

        return true;
    }
}

?>