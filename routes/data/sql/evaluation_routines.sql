CREATE DATABASE  IF NOT EXISTS `evaluation` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `evaluation`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: evaluation
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'evaluation'
--
/*!50003 DROP PROCEDURE IF EXISTS `GetAdminEvaluationSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAdminEvaluationSummary`(
	in _employeeid varchar(20),
	in  _year varchar(20),
	in _department varchar(20)
)
BEGIN
set @id=_employeeid;
set @currentyear=_year;
set @department=_department;

create temporary table Results
select concat(master_supervisor.ms_firstname,' ', master_supervisor.ms_middlename,' ',master_supervisor.ms_lastname) as employeename,
te_subjectid as subjectid,
te_grade as grade,
count(te_grade) as count
from master_supervisor
inner join transaction_evaluation
on master_supervisor.ms_employeeid = transaction_evaluation.te_subjectid
where te_subjectid in (select ms_employeeid as employeeid from master_supervisor where ms_department=@department)
and te_year=@currentyear
group by subjectid, grade
order by subjectid;

create temporary table ExcellentCount select employeename as Eempname, subjectid as Eid ,count as E from Results where grade='5'and subjectid=@id;
create temporary table GoodCount select subjectid as Gid ,count as G from Results where grade='4'and subjectid=@id;
create temporary table SatisfactoryCount select subjectid as Sid ,count as S from Results where grade='3'and subjectid=@id;
create temporary table NeedsWorkCount select subjectid as Noid ,count as N from Results where grade='2'and subjectid=@id;
create temporary table UnsatisfactoryCount select subjectid as Uid ,count as U from Results where grade='1'and subjectid=@id;

create temporary table Employee select distinct employeename from Results where subjectid=@id;

create temporary table Excellent select @id as Eid, if((select count(*) from Results where grade='5'and subjectid=@id) = 0,0,(select E from ExcellentCount where Eid=@id )) as E, (select employeename from Employee) as employeename;
create temporary table Good select @id as Gid, if((select count(*) from Results where grade='4'and subjectid=@id) = 0,0,(select G from GoodCount where Gid=@id )) as G;
create temporary table Satisfactory select @id as Sid, if((select count(*) from Results where grade='3'and subjectid=@id) = 0,0,(select S from SatisfactoryCount where Sid=@id )) as S;
create temporary table NeedsWork select @id as Nid, if((select count(*) from Results where grade='2'and subjectid=@id) = 0,0,(select N from NeedsWorkCount where Nid=@id )) as N;
create temporary table Unsatisfactory select @id as Uid, if((select count(*) from Results where grade='1'and subjectid=@id) = 0,0,(select U from UnsatisfactoryCount where Uid=@id )) as U;

select Eid as employeeid, employeename, E as outstanding, G as vertsatisfactory, S as satisfactory, N as inadequate, U as poor
from Excellent 
inner join Good on Excellent.Eid = Good.Gid
inner join Satisfactory on Good.Gid = Satisfactory.Sid
inner join NeedsWork on Satisfactory.Sid = NeedsWork.Nid
inner join  Unsatisfactory on NeedsWork.Nid = Unsatisfactory.Uid
group by Eid;

drop table Results;
drop table Excellent;
drop table Good;
drop table Satisfactory;
drop table NeedsWork;
drop table Unsatisfactory;

drop table ExcellentCount;
drop table GoodCount;
drop table SatisfactoryCount;
drop table NeedsWorkCount;
drop table UnsatisfactoryCount;
drop table Employee;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEvaluationSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEvaluationSummary`(
	in currentyear varchar(5),
	in employeeid varchar(20),
	in department varchar(120)
)
BEGIN
set @id=employeeid;
set @currentyear=currentyear;
set @department=department;

create temporary table Results
select concat(master_supervisor.ms_firstname,' ', master_supervisor.ms_middlename,' ',master_supervisor.ms_lastname) as employeename,
te_subjectid as subjectid,
te_grade as grade,
count(te_grade) as count
from master_supervisor
inner join transaction_evaluation
on master_supervisor.ms_employeeid = transaction_evaluation.te_subjectid
where te_subjectid in (select ms_employeeid as employeeid from master_supervisor where ms_department=@department)
and te_year=@currentyear
group by subjectid, grade
order by subjectid;

create temporary table ExcellentCount select employeename as Eempname, subjectid as Eid ,count as E from Results where grade='E'and subjectid=@id;
create temporary table GoodCount select subjectid as Gid ,count as G from Results where grade='G'and subjectid=@id;
create temporary table SatisfactoryCount select subjectid as Sid ,count as S from Results where grade='S'and subjectid=@id;
create temporary table NeedsWorkCount select subjectid as Noid ,count as N from Results where grade='N'and subjectid=@id;
create temporary table UnsatisfactoryCount select subjectid as Uid ,count as U from Results where grade='U'and subjectid=@id;
create temporary table NoOpinionCount select subjectid as Noid ,count as O from Results where grade='O'and subjectid=@id;

create temporary table Employee select distinct employeename from Results where subjectid=employeeid;

create temporary table Excellent select @id as Eid, if((select count(*) from Results where grade='E'and subjectid=@id) = 0,0,(select E from ExcellentCount where Eid=@id )) as E, (select employeename from Employee) as employeename;
create temporary table Good select @id as Gid, if((select count(*) from Results where grade='G'and subjectid=@id) = 0,0,(select G from GoodCount where Gid=@id )) as G;
create temporary table Satisfactory select @id as Sid, if((select count(*) from Results where grade='S'and subjectid=@id) = 0,0,(select S from SatisfactoryCount where Sid=@id )) as S;
create temporary table NeedsWork select @id as Nid, if((select count(*) from Results where grade='N'and subjectid=@id) = 0,0,(select N from NeedsWorkCount where Nid=@id )) as N;
create temporary table Unsatisfactory select @id as Uid, if((select count(*) from Results where grade='U'and subjectid=@id) = 0,0,(select U from UnsatisfactoryCount where Uid=@id )) as U;
create temporary table NoOpinion select @id as Noid, if((select count(*) from Results where grade='O'and subjectid=@id) = 0,0,(select O from NoOpinionCount where Noid=@id )) as O;

select Eid as employeeid, employeename, E, G, S, N, U, O
from Excellent 
inner join Good on Excellent.Eid = Good.Gid
inner join Satisfactory on Good.Gid = Satisfactory.Sid
inner join NeedsWork on Satisfactory.Sid = NeedsWork.Nid
inner join  Unsatisfactory on NeedsWork.Nid = Unsatisfactory.Uid
inner join NoOpinion on Unsatisfactory.Uid = NoOpinion.Noid
group by Eid;

drop table Results;
drop table Excellent;
drop table Good;
drop table Satisfactory;
drop table NeedsWork;
drop table Unsatisfactory;
drop table NoOpinion;

drop table ExcellentCount;
drop table GoodCount;
drop table SatisfactoryCount;
drop table NeedsWorkCount;
drop table UnsatisfactoryCount;
drop table NoOpinionCount;
drop table Employee;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetEvaluationSummaryDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetEvaluationSummaryDetails`(
	in _employeeid varchar(20),
	in _year varchar(20),
    in _department varchar(60)
)
BEGIN   
	DECLARE done INT DEFAULT FALSE;
	DECLARE qid varchar(20);
    DECLARE qyear varchar(20);
    DECLARE qcriteria varchar(120);
    DECLARE qquestion text;
    
	DECLARE questions CURSOR FOR
	select 
    _employeeid as qid,
	_year as qyear,
    mc_criterianame as qcriteria, 
    mcq_question as qquestion 
	from master_criteria
	inner join master_criteria_questions on master_criteria.mc_criterianame = master_criteria_questions.mcq_criteria
	where master_criteria.mc_type=_department
	group by master_criteria_questions.mcq_question
	order by master_criteria.mc_criterianame;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    drop table if exists evaluation.evaluationsummaryresult;
    
    create temporary table evaluationsummaryresult (
		id varchar(20), 
		criteria varchar(120),
		question text, 
		outstanding varchar(20), 
		verysatisfactory varchar(20), 
		satisfactory varchar(20), 
		inadequate varchar(20), 
		poor varchar(20));
        
	create temporary table Results
		select
		te_year as year, 
		te_subjectid as subjectid, 
		te_criteria as criteria,
		te_question as question,
		te_grade as grade,
		count(te_grade) as gradecount
		from transaction_evaluation
		where te_subjectid=_employeeid
		group by te_question, te_grade
		order by te_criteria;
        
	OPEN questions;
	my_loop: WHILE NOT done DO
		FETCH questions INTO qid, qyear, qcriteria, qquestion;
        IF NOT done = false THEN
			LEAVE my_loop;
        END IF;
		-- Perform operations on var1, var2, and var3 here
        set @id=qid;
		set @currentyear=qyear;
		set @criteria=qcriteria;
		set @question=qquestion;

		create temporary table Outstanding select @id as OID, if(count(*) = 0,0,gradecount) as O, question as OQ from Results where criteria=@criteria and question=@question and grade='5' and year=@currentyear and subjectid=@id;
		create temporary table VerySatisfactory select @id as VSID, if(count(*) = 0,0,gradecount) as VS, question as VSQ from Results where criteria=@criteria and question=@question and grade='4' and year=@currentyear and subjectid=@id;
		create temporary table Satisfactory select @id as SID, if(count(*) = 0,0,gradecount) as S, question as SQ from Results where criteria=@criteria and question=@question and grade='3' and year=@currentyear and subjectid=@id;
		create temporary table Inadequate select @id as IID, if(count(*) = 0,0,gradecount) as I, question as IQ from Results where criteria=@criteria and question=@question and grade='2' and year=@currentyear and subjectid=@id;
		create temporary table Poor select @id as PID, if(count(*) = 0,0,gradecount) as P, question as PQ from Results where criteria=@criteria and question=@question and grade='1' and year=@currentyear and subjectid=@id;
		
        create temporary table overallresults
		select @id as ID,@criteria as criteria,@question as question,O, VS, S, I, P from Outstanding
		inner join VerySatisfactory on VerySatisfactory.VSID = Outstanding.OID
		inner join Satisfactory on Satisfactory.SID = VerySatisfactory.VSID
		inner join Inadequate on Inadequate.IID = Satisfactory.SID
		inner join Poor on Poor.PID = Inadequate.IID
		order by O;
        
        INSERT INTO evaluationsummaryresult(id, criteria, question, outstanding, verysatisfactory, satisfactory, inadequate, poor)
        SELECT ID, criteria, question, O, VS, S, I, P from overallresults;
        
        drop table Outstanding;
		drop table VerySatisfactory;
		drop table Satisfactory;
		drop table Inadequate;
		drop table Poor;
        drop table overallresults;
	END WHILE;
	CLOSE questions;
		select * from evaluationsummaryresult;
        drop table Results;
		drop table evaluationsummaryresult;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPrintEvaluationSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPrintEvaluationSummary`(
	in _employeeid varchar(20),
	in _year varchar(20),
	in _criteria text,
    in _question text
)
BEGIN
set @id=_employeeid;
set @currentyear=_year;
set @criteria=_criteria;
set @question=_question;

create temporary table Results
select
te_year as year, 
te_subjectid as subjectid, 
te_criteria as criteria,
te_question as question,
te_grade as grade,
count(te_grade) as gradecount
from transaction_evaluation
where te_subjectid=@id
group by te_question, te_grade
order by te_criteria;

create temporary table Outstanding select @id as OID, if(count(*) = 0,0,gradecount) as O, question as OQ from Results where criteria=@criteria and question=@question and grade='5' and year=@currentyear and subjectid=@id;
create temporary table VerySatisfactory select @id as VSID, if(count(*) = 0,0,gradecount) as VS, question as VSQ from Results where criteria=@criteria and question=@question and grade='4' and year=@currentyear and subjectid=@id;
create temporary table Satisfactory select @id as SID, if(count(*) = 0,0,gradecount) as S, question as SQ from Results where criteria=@criteria and question=@question and grade='3' and year=@currentyear and subjectid=@id;
create temporary table Inadequate select @id as IID, if(count(*) = 0,0,gradecount) as I, question as IQ from Results where criteria=@criteria and question=@question and grade='2' and year=@currentyear and subjectid=@id;
create temporary table Poor select @id as PID, if(count(*) = 0,0,gradecount) as P, question as PQ from Results where criteria=@criteria and question=@question and grade='1' and year=@currentyear and subjectid=@id;

select @id as ID,@criteria as criteria,@question as question,O, VS, S, I, P from Outstanding
inner join VerySatisfactory on VerySatisfactory.VSID = Outstanding.OID
inner join Satisfactory on Satisfactory.SID = VerySatisfactory.VSID
inner join Inadequate on Inadequate.IID = Satisfactory.SID
inner join Poor on Poor.PID = Inadequate.IID
order by O;

drop table Results;
drop table Outstanding;
drop table VerySatisfactory;
drop table Satisfactory;
drop table Inadequate;
drop table Poor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSupervisorEvaluationSummary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSupervisorEvaluationSummary`(
	in _employeeid varchar(20),
	in  _year varchar(20),
	in _department varchar(20)
    )
BEGIN
set @id=_employeeid;
set @currentyear=_year;
set @department=_department;

create temporary table Results
select concat(master_supervisor.ms_firstname,' ', master_supervisor.ms_middlename,' ',master_supervisor.ms_lastname) as employeename,
te_subjectid as subjectid,
te_grade as grade,
count(te_grade) as count
from master_supervisor
inner join transaction_evaluation
on master_supervisor.ms_employeeid = transaction_evaluation.te_subjectid
where te_subjectid in (select ms_employeeid as employeeid from master_supervisor where ms_department=@department)
and te_year=@currentyear
group by subjectid, grade
order by subjectid;

create temporary table ExcellentCount select employeename as Eempname, subjectid as Eid ,count as E from Results where grade='E'and subjectid=@id;
create temporary table GoodCount select subjectid as Gid ,count as G from Results where grade='G'and subjectid=@id;
create temporary table SatisfactoryCount select subjectid as Sid ,count as S from Results where grade='S'and subjectid=@id;
create temporary table NeedsWorkCount select subjectid as Noid ,count as N from Results where grade='N'and subjectid=@id;
create temporary table UnsatisfactoryCount select subjectid as Uid ,count as U from Results where grade='U'and subjectid=@id;
create temporary table NoOpinionCount select subjectid as Oid ,count as O from Results where grade='0'and subjectid=@id;

create temporary table Employee select distinct employeename from Results where subjectid=@id;

create temporary table Excellent select @id as Eid, if((select count(*) from Results where grade='E'and subjectid=@id) = 0,0,(select E from ExcellentCount where Eid=@id )) as E, (select employeename from Employee) as employeename;
create temporary table Good select @id as Gid, if((select count(*) from Results where grade='G'and subjectid=@id) = 0,0,(select G from GoodCount where Gid=@id )) as G;
create temporary table Satisfactory select @id as Sid, if((select count(*) from Results where grade='S'and subjectid=@id) = 0,0,(select S from SatisfactoryCount where Sid=@id )) as S;
create temporary table NeedsWork select @id as Nid, if((select count(*) from Results where grade='N'and subjectid=@id) = 0,0,(select N from NeedsWorkCount where Nid=@id )) as N;
create temporary table Unsatisfactory select @id as Uid, if((select count(*) from Results where grade='U'and subjectid=@id) = 0,0,(select U from UnsatisfactoryCount where Uid=@id )) as U;
create temporary table NoOpinion select @id as Oid, if((select count(*) from Results where grade='0'and subjectid=@id) = 0,0,(select O from NoOpinionCount where Oid=@id )) as O;

select Eid as employeeid, employeename, E as excellent, G as good, S as satisfactory, N as needwork, U as unsatisfactory, O as noopinion
from Excellent 
inner join Good on Excellent.Eid = Good.Gid
inner join Satisfactory on Good.Gid = Satisfactory.Sid
inner join NeedsWork on Satisfactory.Sid = NeedsWork.Nid
inner join  Unsatisfactory on NeedsWork.Nid = Unsatisfactory.Uid
inner join  NoOpinion on Unsatisfactory.Uid = NoOpinion.Oid
group by Eid;

drop table Results;
drop table Excellent;
drop table Good;
drop table Satisfactory;
drop table NeedsWork;
drop table Unsatisfactory;
drop table NoOpinion;

drop table ExcellentCount;
drop table GoodCount;
drop table SatisfactoryCount;
drop table NeedsWorkCount;
drop table UnsatisfactoryCount;
drop table NoOpinionCount;
drop table Employee;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetSupervisorEvaluationSummaryDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetSupervisorEvaluationSummaryDetails`(
	in _employeeid varchar(20),
	in _year varchar(20),
    in _department varchar(60)
)
BEGIN
DECLARE done INT DEFAULT FALSE;
	DECLARE qid varchar(20);
    DECLARE qyear varchar(20);
    DECLARE qcriteria varchar(120);
    DECLARE qquestion text;
    
	DECLARE questions CURSOR FOR
	select 
    _employeeid as qid,
	_year as qyear,
    mc_criterianame as qcriteria, 
    mcq_question as qquestion 
	from master_criteria
	inner join master_criteria_questions on master_criteria.mc_criterianame = master_criteria_questions.mcq_criteria
	where master_criteria.mc_type=_department
	group by master_criteria_questions.mcq_question
	order by master_criteria.mc_criterianame;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    drop table if exists evaluation.evaluationsummaryresult;
    
    create temporary table evaluationsummaryresult (
		id varchar(20), 
		criteria varchar(120),
		question text, 
		excellent varchar(20), 
		good varchar(20), 
		satisfactory varchar(20), 
		needwork varchar(20), 
		unsatisfactory varchar(20),
        noopinion varchar(20));
        
	create temporary table Results
		select
		te_year as year, 
		te_subjectid as subjectid, 
		te_criteria as criteria,
		te_question as question,
		te_grade as grade,
		count(te_grade) as gradecount
		from transaction_evaluation
		where te_subjectid=_employeeid
		group by te_question, te_grade
		order by te_criteria;
        
	OPEN questions;
	my_loop: WHILE NOT done DO
		FETCH questions INTO qid, qyear, qcriteria, qquestion;
        IF NOT done = false THEN
			LEAVE my_loop;
        END IF;
		-- Perform operations on var1, var2, and var3 here
        set @id=qid;
		set @currentyear=qyear;
		set @criteria=qcriteria;
		set @question=qquestion;

		create temporary table Exellent select @id as EID, if(count(*) = 0,0,gradecount) as E, question as EQ from Results where criteria=@criteria and question=@question and grade='E' and year=@currentyear and subjectid=@id;
		create temporary table Good select @id as GID, if(count(*) = 0,0,gradecount) as G, question as GQ from Results where criteria=@criteria and question=@question and grade='G' and year=@currentyear and subjectid=@id;
		create temporary table Satisfactory select @id as SID, if(count(*) = 0,0,gradecount) as S, question as SQ from Results where criteria=@criteria and question=@question and grade='S' and year=@currentyear and subjectid=@id;
		create temporary table NeedWork select @id as NID, if(count(*) = 0,0,gradecount) as N, question as NQ from Results where criteria=@criteria and question=@question and grade='N' and year=@currentyear and subjectid=@id;
		create temporary table Unsatisfactory select @id as UID, if(count(*) = 0,0,gradecount) as U, question as UQ from Results where criteria=@criteria and question=@question and grade='U' and year=@currentyear and subjectid=@id;
        create temporary table NoOpinion select @id as OID, if(count(*) = 0,0,gradecount) as O, question as OQ from Results where criteria=@criteria and question=@question and grade='0' and year=@currentyear and subjectid=@id;
		
        create temporary table overallresults
		select @id as ID,@criteria as criteria,@question as question,E, G, S, N, U, O from Exellent
		inner join Good on Good.GID = Exellent.EID
		inner join Satisfactory on Satisfactory.SID = Good.GID
		inner join NeedWork on NeedWork.NID = Satisfactory.SID
		inner join Unsatisfactory on Unsatisfactory.UID = NeedWork.NID
        inner join NoOpinion on NoOpinion.OID = Unsatisfactory.UID
		order by O;
        
        INSERT INTO evaluationsummaryresult(id, criteria, question, excellent, good, satisfactory, needwork, unsatisfactory, noopinion)
        SELECT ID, criteria, question, E, G, S, N, U, O from overallresults;
        
        drop table Exellent;
		drop table Good;
		drop table Satisfactory;
		drop table NeedWork;
		drop table Unsatisfactory;
        drop table NoOpinion;
        drop table overallresults;
	END WHILE;
	CLOSE questions;
		select * from evaluationsummaryresult;
        drop table Results;
		drop table evaluationsummaryresult;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-25 16:15:52
